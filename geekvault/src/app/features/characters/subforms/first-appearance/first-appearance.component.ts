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

  // Valores alineados con tu tipo: 'comic'|'tv'|'movie'|'game'|'anime'|'novel'|'other'
  mediums = [
    { value: 'comic', label: 'Cómic' },
    { value: 'tv',    label: 'Serie/TV' },
    { value: 'movie', label: 'Película' },
    { value: 'anime', label: 'Anime' },
    { value: 'game',  label: 'Videojuego' },
    { value: 'novel', label: 'Novela' },
    { value: 'other', label: 'Otro' }
  ];

  imagePreview(): string | null {
    const ctrl = this.group.get('imageFile');
    const val = ctrl?.value;
    return typeof val === 'string' ? val : null;
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => this.group.get('imageFile')?.setValue(reader.result as string);
    reader.readAsDataURL(file);

  }

  clearImage(): void {
    this.group.get('imageFile')?.setValue(null);
  }
}
