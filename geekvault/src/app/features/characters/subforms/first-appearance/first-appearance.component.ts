import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-first-appearance-subform',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './first-appearance.component.html',
  styleUrls: ['./first-appearance.component.scss']
})
export class FirstAppearanceComponent {
  @Input({ required: true }) group!: FormGroup;

  mediums = [
    { value: 'comic', label: 'Cómic' },
    { value: 'tv',    label: 'Serie/TV' },
    { value: 'movie', label: 'Película' },
    { value: 'anime', label: 'Anime' },
    { value: 'videogame', label: 'Videojuego' }
  ];
}
