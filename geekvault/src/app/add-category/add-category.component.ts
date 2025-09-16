import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../core/services/category.service';
import { CategoryCreateRequest } from '../core/models/category.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss'
})
export class AddCategoryComponent {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);

  categoryForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['']
  });

  loading = false;
  serverError = '';
  successMessage = '';

  onSubmit() {
    this.serverError = '';
    this.successMessage = '';

    if (this.categoryForm.invalid) return;

    const payload: CategoryCreateRequest = {
      name: this.categoryForm.value.name.trim(),
      description: this.categoryForm.value.description?.trim() || null
    };

    this.loading = true;
    this.categoryService.create(payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (created) => {
          this.successMessage = `Categoría creada: ${created.name}`;
          this.categoryForm.reset();
          // opcional: marcar pristine/touched
          this.categoryForm.markAsPristine();
          this.categoryForm.markAsUntouched();
        },
        error: (err) => {
          // Manejo 409 (duplicado) u otros
          const msg = err?.error?.message || err?.message || 'Error al crear la categoría.';
          this.serverError = msg;
        }
      });
  }

  // helpers para UX (mostrar errores)
  get name() { return this.categoryForm.get('name'); }
}
