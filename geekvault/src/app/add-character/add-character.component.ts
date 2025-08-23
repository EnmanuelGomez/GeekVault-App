import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-character',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-character.component.html',
  styleUrls: ['./add-character.component.scss']
})
export class AddCharacterComponent {
  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  readonly currentYear = new Date().getFullYear();
  imagePreview = signal<string | null>(null);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    universe: ['', [Validators.required]],
    creator: ['', [Validators.required]],
    yearCreated: [
      this.currentYear,
      [Validators.required, Validators.min(1895), Validators.max(this.currentYear)]
    ],
    summary: [''],
    imageFile: [null as File | null]
  });

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.clearImage();
      return;
    }
    const file = input.files[0];
    this.form.patchValue({ imageFile: file });

    const prev = this.imagePreview();
    if (prev) URL.revokeObjectURL(prev);

    const url = URL.createObjectURL(file);
    this.imagePreview.set(url);

    this.destroyRef.onDestroy(() => URL.revokeObjectURL(url));
  }

  clearImage() {
    const prev = this.imagePreview();
    if (prev) URL.revokeObjectURL(prev);
    this.imagePreview.set(null);
    this.form.patchValue({ imageFile: null });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Nuevo personaje:', this.form.value);
    this.form.reset({
      name: '',
      universe: '',
      creator: '',
      yearCreated: this.currentYear,
      summary: '',
      imageFile: null
    });
    this.clearImage();
  }

  resetForm() {
    this.form.reset({
      name: '',
      universe: '',
      creator: '',
      yearCreated: this.currentYear,
      summary: '',
      imageFile: null
    });
    this.clearImage();
  }

  get f() { return this.form.controls; }

  // Placeholders para los botones "+" de las secciones
  onLeftAdd()  { console.log('Acción "+" en sección izquierda'); }
  onRightAdd() { console.log('Acción "+" en sección derecha'); }
  onBottomAdd(){ console.log('Acción "+" en sección inferior'); }
}
