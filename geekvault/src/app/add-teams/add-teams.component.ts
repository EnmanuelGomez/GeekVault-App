import { CommonModule } from '@angular/common';
import { Component, DestroyRef, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'gv-add-teams',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-teams.component.html',
  styleUrls: ['./add-teams.component.scss']
})
export class AddTeamsComponent implements OnInit {
  @Output() teamCreate = new EventEmitter<FormData>();

  private fb = inject(FormBuilder);
  private sanitizer = inject(DomSanitizer);
  private destroyRef = inject(DestroyRef);

  currentYear = new Date().getFullYear();
  isSubmitting = signal(false);

  // Imagen
  imageFile: File | null = null;
  imagePreview: SafeUrl | null = null;
  objectUrl: string | null = null;
  readonly MAX_IMAGE_MB = 5;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
    year: [
      this.currentYear,
      [
        Validators.required,
        Validators.min(1850),
        Validators.max(new Date().getFullYear()),
        Validators.pattern(/^\d{4}$/)
      ]
    ],
    imageName: ['']
  });

  ngOnInit(): void {
    this.destroyRef.onDestroy(() => this.revokePreview());
  }

  get f() { return this.form.controls; }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (!file) return;

    if (!file.type.startsWith('image/')) { this.form.setErrors({ invalidImageType: true }); return; }
    const mb = file.size / (1024 * 1024);
    if (mb > this.MAX_IMAGE_MB) { this.form.setErrors({ imageTooLarge: true }); return; }

    this.imageFile = file;
    this.f.imageName.setValue(file.name);
    this.makePreview(file);
  }

  onDrop(ev: DragEvent) {
    ev.preventDefault();
    if (!ev.dataTransfer?.files?.length) return;
    const file = ev.dataTransfer.files[0];
    const fakeEvent = { target: { files: [file] } } as unknown as Event;
    this.onFileSelected(fakeEvent);
  }
  onDragOver(ev: DragEvent) { ev.preventDefault(); }
  onDragLeave() { /* estilos opcionales */ }

  removeImage() {
    this.imageFile = null;
    this.f.imageName.setValue('');
    this.revokePreview();
  }

  private makePreview(file: File) {
    this.revokePreview();
    this.objectUrl = URL.createObjectURL(file);
    this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(this.objectUrl);
  }
  private revokePreview() {
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = null;
    this.imagePreview = null;
  }

  submit() {
    if (this.form.invalid || !this.imageFile) {
      this.form.markAllAsTouched();
      if (!this.imageFile) this.form.setErrors({ imageRequired: true });
      return;
    }

    this.isSubmitting.set(true);

    // Construye el payload y EMITE al padre (sin llamar servicios)
    const fd = new FormData();
    fd.append('name', this.f.name.value!.trim());
    fd.append('year', String(this.f.year.value));
    fd.append('image', this.imageFile, this.imageFile.name);

    this.teamCreate.emit(fd);

    // Limpieza rápida del form (el padre puede controlar navegación/toasts)
    this.isSubmitting.set(false);
    this.form.reset({ year: this.currentYear, imageName: '' });
    this.removeImage();
  }
}
