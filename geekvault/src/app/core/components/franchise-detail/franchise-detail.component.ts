import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FranchiseService } from '../../services/franchise.service';
import { CharacterService } from '../../services/character.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';

@Component({
  selector: 'app-franchise-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['./franchise-detail.component.scss'],
  templateUrl: './franchise-detail.component.html'
})
export class FranchiseDetailComponent {
  private route = inject(ActivatedRoute);
  private franchiseSvc = inject(FranchiseService);
  private characterSvc = inject(CharacterService);

  vm$ = this.route.paramMap.pipe(
    map(p => p.get('id')!),
    switchMap(id =>
      combineLatest({
        franchise: this.franchiseSvc.getById(id),
        characters: this.characterSvc.getByFranchise(id)
      })
    ),
    map(data => ({ ...data, error: null as string | null })),
    catchError(() => of({ franchise: null, characters: [], error: 'No se pudo cargar la franquicia.' }))
  );

  onImgError(ev: Event) {
    const el = ev.target as HTMLImageElement | null;
    if (el) {
      el.src = 'assets/placeholders/character-portrait.png';
    }
  }

  trackByCharId = (_: number, c: { id: string }) => c.id;
}
