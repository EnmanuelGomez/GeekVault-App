import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-versions-subform',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './versions.component.html',
  styleUrls: ['./versions.component.scss'] // <-- corregido
})
export class VersionSubformComponent {
  @Input({ required: true }) group!: FormGroup; // <- este es el FormGroup 'subforms' que contiene 'versions' (FormArray)

  constructor(private fb: FormBuilder) {}

  get versions(): FormArray {
    return this.group.get('versions') as FormArray;
  }

  addVersion() {
    this.versions.push(this.fb.group({
      imageFile: this.fb.control<File | string | null>(null), // guardaremos DataURL (string) o File
      medium: this.fb.control<'comic'|'tv'|'movie'|'game'|'anime'|'novel'|'other'>('comic', { validators: [Validators.required] }),
      title: ['', [Validators.required, Validators.minLength(2)]],
      continuity: [''],
      firstAppearanceRef: [''],
      createdBy: ['']
    }));
  }

  removeVersion(index: number) {
    this.versions.removeAt(index);
  }

  imagePreview(i: number): string | null {
    const ctrl = (this.versions.at(i) as FormGroup).get('imageFile');
    const val = ctrl?.value;

    return typeof val === 'string' ? val : null;
  }

  onFileSelected(event: Event, i: number): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      (this.versions.at(i) as FormGroup).get('imageFile')?.setValue(reader.result as string);
    };
    reader.readAsDataURL(file);

  }

  clearImage(i: number): void {
    (this.versions.at(i) as FormGroup).get('imageFile')?.setValue(null);
  }
}
