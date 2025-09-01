import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Character } from '../../models/character.model';

@Component({
  selector: 'app-character-card',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./character-card.component.scss'],
  template: `
    <figure class="char-card" [attr.title]="character?.name">
      <div class="img-wrap">
        <img
          [src]="character?.imageUrl || 'assets/placeholders/character-fallback.png'"
          (error)="onError($event)"
          [alt]="character?.name || 'Personaje'"
          loading="lazy"
        />
      </div>
      <figcaption class="char-name">{{ character?.name }}</figcaption>
    </figure>
  `
})
export class CharacterCardComponent {
  @Input() character!: Character;

  onError(ev: Event) {
    (ev.target as HTMLImageElement).src = 'assets/placeholders/character-fallback.png';
  }
}
