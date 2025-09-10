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

  // Devuelve la URL de la imagen guardada en el form
  imagePreview(): string | null {
    const imageControl = this.group.get('image');
    return imageControl && imageControl.value ? imageControl.value : null;
  }

  // Si quieres manejar la carga de archivos desde un input
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.group.get('image')?.setValue(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

}
