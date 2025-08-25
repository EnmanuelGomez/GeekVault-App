import { Component, DestroyRef, Type, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';

import { createCharacterForm } from '../features/characters/forms/character.forms';

// Subforms (standalone)
import { FirstAppearanceComponent } from '../features/characters/subforms/first-appearance/first-appearance.component';
import { PowersAbilitiesComponent } from '../features/characters/subforms/powers-abilities/powers-abilities.component';
import { StatsSubformComponent } from '../features/characters/subforms/stats/stats.component';

type SectionKey = 'left' | 'right' | 'bottom';
type SubformKey = 'firstAppearance' | 'powers' | 'stats';

interface SubformMeta {
  key: SubformKey;
  title: string;
  component: Type<unknown>;
  // Función que devuelve el control/grupo que el subform espera como @Input() group
  selectInput: (root: FormGroup) => any;
}

@Component({
  selector: 'app-add-character',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // Registrar subforms para que *ngComponentOutlet* pueda usarlos
   /* FirstAppearanceComponent,
    PowersAbilitiesComponent,
    StatsSubformComponent*/
  ],
  templateUrl: './add-character.component.html',
  styleUrls: ['./add-character.component.scss']
})
export class AddCharacterComponent {
  private fb = inject(NonNullableFormBuilder);
  private destroyRef = inject(DestroyRef);

  readonly currentYear = new Date().getFullYear();
  imagePreview = signal<string | null>(null);

  form = createCharacterForm(this.fb, this.currentYear);

  // === REGISTRO de subforms disponibles ===
  readonly subforms: SubformMeta[] = [
    {
      key: 'firstAppearance',
      title: 'Primera aparición',
      component: FirstAppearanceComponent,
      selectInput: (root) => root.get('subforms.firstAppearance') as FormGroup
    },
    {
      key: 'powers',
      title: 'Poderes y habilidades',
      component: PowersAbilitiesComponent,
      // Este subform espera el group que contiene el FormArray "powers"
      selectInput: (root) => root.get('subforms') as FormGroup
    },
    {
      key: 'stats',
      title: 'Estadísticas',
      component: StatsSubformComponent,
      selectInput: (root) => root.get('subforms.stats') as FormGroup
    }
  ];

  // === Dónde está colocado cada subform (si está visible) ===
  placed: Record<SectionKey, SubformKey[]> = {
    left:   [],
    right:  [],
    bottom: []
  };

  // Menú (picker) abierto en qué sección
  menuOpen: SectionKey | null = null;

  // Imagen
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

  // === UI: abrir/cerrar picker ===
  openPicker(section: SectionKey) {
    this.menuOpen = section;
  }
  closePicker() {
    this.menuOpen = null;
  }

  // === Helpers de registro ===
  metaFor(key: SubformKey): SubformMeta {
    const found = this.subforms.find(s => s.key === key);
    if (!found) throw new Error(`Subform no registrado: ${key}`);
    return found;
  }
  inputFor(key: SubformKey) {
    return this.metaFor(key).selectInput(this.form);
  }

  // === Colocar subforms dinámicamente ===
  attachTo(section: SectionKey, key: SubformKey) {
    // Si ya está en otra sección, removerlo de allí
    (Object.keys(this.placed) as SectionKey[]).forEach(sec => {
      if (sec !== section) {
        const idx = this.placed[sec].indexOf(key);
        if (idx >= 0) this.placed[sec].splice(idx, 1);
      }
    });

    // Evitar duplicados en la misma sección
    if (!this.placed[section].includes(key)) {
      this.placed[section].push(key);
    }
    this.closePicker();
  }

  // Remover manualmente un subform de una sección
  removeFrom(section: SectionKey, key: SubformKey) {
    const idx = this.placed[section].indexOf(key);
    if (idx >= 0) this.placed[section].splice(idx, 1);
  }

  // Para mostrar solo los que aún no están colocados
  availableSubformsFor(section: SectionKey) {
    const alreadyPlaced = new Set([
      ...this.placed.left,
      ...this.placed.right,
      ...this.placed.bottom
    ]);
    // Si quieres permitir “mover” desde el picker, comenta el filtro y déjalos todos
    return this.subforms.filter(s => !alreadyPlaced.has(s.key));
  }

  get f() { return this.form.controls; }
}
