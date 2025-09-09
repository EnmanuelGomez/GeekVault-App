import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { CharacterService, CharacterDetail } from '../../../core/services/character.service';
import { CharacterType } from '../../../core/models/character-type.model';

export type StatKey =
  | 'strength' | 'speed' | 'skills' | 'weapons'
  | 'intelligence' | 'durability' | 'endurance'
  | 'experience' | 'fighting' | 'power';

type Medium = 'comic' | 'tv' | 'movie' | 'game' | 'anime' | 'novel' | 'other';

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.scss']
})
export class CharacterDetailComponent {
  private route = inject(ActivatedRoute);
  private characterSvc = inject(CharacterService);

  character: CharacterDetail | null = null;
  categories: CharacterType[] = [];

  // Claves tipadas de StatBlock para el *ngFor
  statKeys: StatKey[] = [
    'strength','speed','skills','weapons',
    'intelligence','durability','endurance',
    'experience','fighting','power'
  ];

  franchiseName: string | null = null;

  constructor() {
    const resolved = this.route.snapshot.data['character'] as CharacterDetail | undefined;
    if (resolved) {
      this.character = resolved;
      this.ensureCategories();
      this.ensureFranchise();
    } else {
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.characterSvc.getById(id).subscribe({
          next: (c) => {
            this.character = c;
            this.ensureCategories();
            this.ensureFranchise();
          },
          error: () => (this.character = null),
        });
      }
    }
  }

   private ensureFranchise() {
    if (!this.character?.franchiseId) return;

    this.characterSvc.getFranchiseById(this.character.franchiseId).subscribe({
      next: (f) => (this.franchiseName = f?.name ?? null),
      error: () => (this.franchiseName = null),
    });
  }

  private ensureCategories() {
  if (!this.character) return;
  const id = this.character.id;

  if (this.character.categories && this.character.categories.length > 0) {
    this.categories = this.character.categories;
  } else {
    this.characterSvc.getCategoriesByCharacter(id).subscribe({
      next: (cats) => (this.categories = cats ?? []),
      error: () => (this.categories = []),
    });
  }
}

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/placeholders/character-portrait.png';
  }

  mediumLabel(m: Medium) {
    const map: Record<Medium, string> = {
      comic: 'Cómic', tv: 'TV', movie: 'Película', game: 'Videojuego',
      anime: 'Anime', novel: 'Novela', other: 'Otro',
    };
    return map[m] ?? m;
  }

   categoryList(): string {
    const list = this.categories?.map(c => c.name) ?? [];
    return list.join(', ');
  }

  getStat(
    s: NonNullable<CharacterDetail['stats']>,
    k: keyof NonNullable<CharacterDetail['stats']>
  ): number {
    const v = Number(s?.[k] ?? 0);
    return Number.isFinite(v) ? v : 0;
  }

  barPercent(v: number) {
    const clamped = Math.max(1, Math.min(10, Number(v || 0)));
    return (clamped / 10) * 100;
  }
}
