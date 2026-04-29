import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { catchError, of, shareReplay, tap } from 'rxjs';
import { CharacterType } from '../../../core/models/character-type.model';
import { CharacterTypesService } from '../../../core/services/character-types.service';

@Component({
  selector: 'app-character-types-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './character-types-list.component.html',
  styleUrls: ['./character-types-list.component.scss']
})
export class CharacterTypesListComponent {
  private svc = inject(CharacterTypesService);
  private router = inject(Router);

  loading = true;
  error: string | number | null = null;
  success = '';

  // Estados para confirmación/borrado (como string normalizado)
  confirmingId: string | null = null;
  deletingId: string | null = null;

  // Stream de categorías
  characterType$ = this.svc.getAll().pipe(
    tap(() => { this.loading = false; this.error = null; }),
    catchError(err => {
      console.error('[CharacterTypeList] error', err);
      this.loading = false;
      this.error = 'No se pudieron cargar las categorías.';
      return of([] as CharacterType[]);
    }),
    shareReplay(1)
  );

  /** Helper: normaliza el id a string ('' si viene null/undefined) */
  toId(item: { id: string | number | null | undefined }): string {
    const v = item?.id;
    return (v === null || v === undefined) ? '' : String(v);
  }

  /** trackBy estable usando el id normalizado */
  trackById = (_: number, c: CharacterType) => this.toId(c as any);

  /** Navegar al editar: acepta union y normaliza a string */
  goEdit(id: string | number | null | undefined) {
    const sid = (id == null) ? '' : String(id);
    if (!sid) return; // si no hay id, no navegamos
    this.router.navigate(['/character-types', sid, 'edit']);
  }

  /** Abrir modal de confirmación: acepta union y normaliza */
  askDelete(id: string | number | null | undefined) {
    const sid = (id == null) ? '' : String(id);
    if (!sid) return;
    this.success = '';
    this.error = null;
    this.confirmingId = sid;
  }

  cancelDelete() {
    this.confirmingId = null;
  }

  /** Confirmar borrado: aquí ya trabajamos sólo con string */
  confirmDelete(id: string) {
    this.deletingId = id;
    this.svc.delete(id).subscribe({
      next: () => {
        this.success = 'Categoría eliminada correctamente.';
        this.confirmingId = null;
        this.deletingId = null;
        // recargar listado sin F5
        this.reload();
      },
      error: (err) => {
        const msg = err?.error?.message || err?.message || 'No se pudo eliminar la categoría.';
        this.error = msg; // p.ej. 409: "La categoría está en uso…"
        this.confirmingId = null;
        this.deletingId = null;
      }
    });
  }

  /** Recargar stream (evita refrescar toda la página) */
  reload() {
    this.loading = true;
    this.characterType$ = this.svc.getAll().pipe(
      tap(() => { this.loading = false; this.error = null; }),
      catchError(err => {
        console.error('[CharacterTypeList] error reload', err);
        this.loading = false;
        this.error = 'No se pudieron cargar las categorías de personaje.';
        return of([] as CharacterType[]);
      }),
      shareReplay(1)
    );
  }
}
