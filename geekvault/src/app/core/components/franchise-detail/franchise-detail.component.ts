import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { FranchiseService } from '../../services/franchise.service';
import { CharacterService } from '../../services/character.service';

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
    switchMap(params => {
      const id = params.get('id')!;
      return forkJoin({
        franchise: this.franchiseSvc.getById(id).pipe(catchError(() => of(null))),
        characters: this.characterSvc.getByFranchise(id).pipe(catchError(() => of([])))
      });
    }),
    map(({ franchise, characters }) => ({ franchise, characters }))
  );

  trackByCharId = (_: number, c: { id: string }) => c.id;

  onImgError(ev: Event) {
    const el = ev.target as HTMLImageElement | null;
    if (el) el.src = 'assets/placeholders/character-portrait.png';
  }
}
