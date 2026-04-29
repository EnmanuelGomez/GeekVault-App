// add-character-category.component.ts
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CharacterTypesService } from '../core/services/character-types.service';
import { CharacterTypeCreateRequest } from '../core/models/character-type.model';

@Component({
  selector: 'app-add-character-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-character-category.component.html',
  styleUrls: ['./add-character-category.component.scss']
})
export class AddCharacterCategoryComponent {
  private fb = inject(FormBuilder);
  private characterTypesSvc = inject(CharacterTypesService);

  characterCategoryForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['']
  });

  // señales para feedback UI (Angular 16+)
  loading = signal(false);
  errorMsg = signal<string | null>(null);
  successMsg = signal<string | null>(null);

  onSubmit() {
    this.errorMsg.set(null);
    this.successMsg.set(null);

    if (this.characterCategoryForm.invalid) {
      this.characterCategoryForm.markAllAsTouched();
      return;
    }

    const dto: CharacterTypeCreateRequest = {
      name: this.characterCategoryForm.value.name,
      description: this.characterCategoryForm.value.description ?? null
    };

    this.loading.set(true);
    this.characterTypesSvc.create(dto).subscribe({
      next: (created) => {
        this.loading.set(false);
        this.successMsg.set(`Categoría creada: ${created.name}`);
        this.characterCategoryForm.reset(); // limpia el formulario
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set('No se pudo crear la categoría. Verifica el backend/CORS y vuelve a intentar.');
        console.error(err);
      }
    });
  }

  // helpers para mostrar errores de validación
  get nameCtrl() { return this.characterCategoryForm.get('name'); }
}
