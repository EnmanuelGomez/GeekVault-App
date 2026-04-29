import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Category } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';
import { catchError, of, shareReplay, tap } from 'rxjs';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent {
  private svc = inject(CategoryService);
  private router = inject(Router);

  loading = true;
  error: string | null = null;
  success = '';

  // manejo de confirmación/borrado
  confirmingId: string | null = null;
  deletingId: string | null = null;

  categories$ = this.svc.getAll().pipe(
    tap(() => { this.loading = false; this.error = null; }),
    catchError(err => {
      console.error('[CategoriesList] error', err);
      this.loading = false;
      this.error = 'No se pudieron cargar las categorías.';
      return of([] as Category[]);
    }),
    shareReplay(1)
  );

  trackById = (_: number, c: Category) => c.id;

  goEdit(id: string) {
    this.router.navigate(['/categories', id, 'edit']);
  }

  askDelete(id: string) {
    this.success = '';
    this.error = null;
    this.confirmingId = id;
  }
  cancelDelete() {
    this.confirmingId = null;
  }

  confirmDelete(id: string) {
    this.deletingId = id;
    this.svc.delete(id).subscribe({
      next: () => {
        this.success = 'Categoría eliminada correctamente.';
        this.confirmingId = null;
        this.deletingId = null;
        // recargar listado
        this.reload();
      },
      error: (err: any) => {
        const msg = err?.error?.message || err?.message || 'No se pudo eliminar la categoría.';
        this.error = msg; // p.ej. 409: "La categoría está en uso…"
        this.confirmingId = null;
        this.deletingId = null;
      }
    });
  }

  // recargar stream (así evitamos F5)
  reload() {
    this.loading = true;
    this.categories$ = this.svc.getAll().pipe(
      tap(() => { this.loading = false; this.error = null; }),
      catchError(err => {
        console.error('[CategoriesList] error reload', err);
        this.loading = false;
        this.error = 'No se pudieron cargar las categorías.';
        return of([] as Category[]);
      }),
      shareReplay(1)
    );
  }
}
