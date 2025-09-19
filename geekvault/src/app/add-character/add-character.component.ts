// add-character.component.ts
// ==============================================
// Componente: Agregar Personaje
// - Carga tipos de personaje desde API
// - Permite seleccionar múltiples categorías (IDs tipo string)
// - Muestra chips removibles
// - Renderiza subforms dinámicos (firstAppearance, powers, stats)
// ==============================================

import { Component, DestroyRef, Type, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, FormGroup } from '@angular/forms';

import { createCharacterForm } from '../features/characters/forms/character.forms';

// Subforms (standalone)
import { FirstAppearanceComponent } from '../features/characters/subforms/first-appearance/first-appearance.component';
import { PowersAbilitiesSubformComponent } from '../features/characters/subforms/powers-abilities/powers-abilities.component';
import { StatsSubformComponent } from '../features/characters/subforms/stats/stats.component';

// Servicios / modelos
import { CharacterTypesService } from '../core/services/character-types.service';
import { CharacterType } from '../core/models/character-type.model';
import { VersionSubformComponent } from '../features/characters/subforms/versions/versions.component';
import { FranchiseService } from '../core/services/franchise.service';
import { Franchise } from '../core/models/franchise.model';

// ----------------------------------------------
// Tipos internos para el sistema de subforms
// ----------------------------------------------
type SectionKey = 'left' | 'right' | 'bottom';
type SubformKey = 'firstAppearance' | 'powers' | 'stats' | 'versions';

interface SubformMeta {
  key: SubformKey;
  title: string;
  component: Type<unknown>;
  // Devuelve el control/grupo que el subform espera como @Input() group
  selectInput: (root: FormGroup) => any;
}

@Component({
  selector: 'app-add-character',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-character.component.html',
  styleUrls: ['./add-character.component.scss']
})
export class AddCharacterComponent implements OnInit {

  // ----------------------------------------------
  // Inyecciones / estado base
  // ----------------------------------------------
  private fb = inject(NonNullableFormBuilder);
  private destroyRef = inject(DestroyRef);
  private characterTypesSvc = inject(CharacterTypesService);
  private franchiseSvc = inject(FranchiseService);

  readonly currentYear = new Date().getFullYear();
  imagePreview = signal<string | null>(null);

  // Form principal (asegúrate de que 'categories' sea string[] en character.forms.ts)
  form = createCharacterForm(this.fb, this.currentYear);
  // Form principal 'franchise'
  franchises: Franchise[] = [];
  private franchiseMap = new Map<string, string>(); // id -> name

  // ----------------------------------------------
  // Categorías (catálogo y utilidades)
  // ----------------------------------------------
  characterTypes: CharacterType[] = [];           // catálogo desde API
  private typesMap = new Map<string, string>();   // id(string) -> name

  // ----------------------------------------------
  // Registro de subforms disponibles (dinámicos)
  // ----------------------------------------------
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
      component: PowersAbilitiesSubformComponent,
      // Este subform espera el group que contiene el FormArray "powers"
      selectInput: (root) => root.get('subforms') as FormGroup
    },
    {
      key: 'stats',
      title: 'Estadísticas',
      component: StatsSubformComponent,
      selectInput: (root) => root.get('subforms.stats') as FormGroup
    },
    {
      key: 'versions',
      title: 'Versiones',
      component: VersionSubformComponent,
      selectInput: (root) => root.get('subforms') as FormGroup
    }
  ];

  // Dónde se colocó cada subform en la UI
  placed: Record<SectionKey, SubformKey[]> = {
    left:   [],
    right:  [],
    bottom: []
  };

  // Picker abierto en sección
  menuOpen: SectionKey | null = null;

  // ----------------------------------------------
  // Ciclo de vida: cargar catálogo de categorías y franquicias
  // ----------------------------------------------
  ngOnInit(): void {
    this.characterTypesSvc.getAll().subscribe({
      next: (types) => {
        // Normalizamos a string los IDs por si backend envía números
        this.characterTypes = (types ?? []).map(t => ({
          ...t,
          id: String((t as any).id) // fuerza string
        }));
        // Construimos mapa id->name para resolver nombres rápido
        this.typesMap = new Map(this.characterTypes.map(t => [String(t.id), t.name]));
      },
      error: (err) => {
        console.error('Error cargando CharacterTypes', err);
        this.characterTypes = [];
        this.typesMap.clear();
      }
    });

    // Cargar FRANQUICIAS
    this.franchiseSvc.getAll().subscribe({
      next: (list) => {
        this.franchises = (list ?? []).map(f => ({
          ...f,
          id: String((f as any).id),
        }));
        this.franchiseMap = new Map(this.franchises.map(f => [String(f.id), f.name]));
      },
      error: (err) => {
        console.error('Error cargando Franchises', err);
        this.franchises = [];
        this.franchiseMap.clear();
      }
    });
  }

   // Helper para mostrar nombre de franquicia si lo necesitas en chips/logs
  franchiseNameFor(id: string | number) {
    return this.franchiseMap.get(String(id)) ?? `#${id}`;
  }

  // ----------------------------------------------
  // Imagen: manejo de selección / limpieza
  // ----------------------------------------------
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

  // ----------------------------------------------
  // Getters / helpers de formulario
  // ----------------------------------------------
  get f() { return this.form.controls; }

  // Devuelve el nombre de la categoría por ID (string)
  nameFor(id: string | number): string {
    return this.typesMap.get(String(id)) ?? `#${id}`;
  }

  // Verifica si una categoría (por ID string) ya está seleccionada
  isSelected(id: string): boolean {
    const selected: string[] = this.f['categories'].value ?? [];
    return selected.includes(id);
  }

  // ----------------------------------------------
  // Selección de categorías (selector + chips)
  // ----------------------------------------------
  onCategoryPicked(ev: Event): void {
    const sel = ev.target as HTMLSelectElement;
    const raw = sel.value;           // siempre string
    if (!raw) return;

    const id = String(raw);          // 🔑 tratamos ID como string
    this.addCategory(id);

    sel.value = '';                  // reset selector para próxima selección
  }

  addCategory(id: string): void {
    const current: string[] = this.f['categories'].value ?? [];
    if (!current.includes(id)) {
      this.f['categories'].setValue([...current, id]);
      this.f['categories'].markAsDirty();
      this.f['categories'].markAsTouched();
    }
  }

  removeCategory(id: string): void {
    const current: string[] = this.f['categories'].value ?? [];
    this.f['categories'].setValue(current.filter(x => x !== id));
    this.f['categories'].markAsDirty();
    this.f['categories'].markAsTouched();
  }

  // ----------------------------------------------
  // Submit / Reset
  // ----------------------------------------------
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // En este punto, this.form.value.categories es string[]
    console.log('Nuevo personaje:', this.form.value);

    this.form.reset({
      name: '',
      alias: '',
      franchiseId: '',
      creator: '',
      yearCreated: this.currentYear,
      summary: '',
      imageFile: null,
      categories: []   // limpiar selección
    });
    this.clearImage();
  }

  resetForm() {
    this.form.reset({
      name: '',
      alias: '',
      franchiseId: '',
      creator: '',
      yearCreated: this.currentYear,
      summary: '',
      imageFile: null,
      categories: []   // limpiar selección
    });
    this.clearImage();
  }

  // ----------------------------------------------
  // UI: Picker para colocar subforms en secciones
  // ----------------------------------------------
  openPicker(section: SectionKey) { this.menuOpen = section; }
  closePicker() { this.menuOpen = null; }

  // ----------------------------------------------
  // Subforms: helpers para render dinámico
  // ----------------------------------------------
  metaFor(key: SubformKey): SubformMeta {
    const found = this.subforms.find(s => s.key === key);
    if (!found) throw new Error(`Subform no registrado: ${key}`);
    return found;
  }
  inputFor(key: SubformKey) {
    return this.metaFor(key).selectInput(this.form);
  }

  // ----------------------------------------------
  // Subforms: colocar / remover dinámicamente
  // ----------------------------------------------
  attachTo(section: SectionKey, key: SubformKey) {
    // Si ya está en otra sección, removerlo de allí
    (Object.keys(this.placed) as SectionKey[]).forEach(sec => {
      if (sec !== section) {
        const idx = this.placed[sec].indexOf(key);
        if (idx >= 0) this.placed[sec].splice(idx, 1);
      }
    });

    // Evitar duplicado en la misma sección
    if (!this.placed[section].includes(key)) {
      this.placed[section].push(key);
    }
    this.closePicker();
  }

  removeFrom(section: SectionKey, key: SubformKey) {
    const idx = this.placed[section].indexOf(key);
    if (idx >= 0) this.placed[section].splice(idx, 1);
  }

  availableSubformsFor(section: SectionKey) {
    const alreadyPlaced = new Set([
      ...this.placed.left,
      ...this.placed.right,
      ...this.placed.bottom
    ]);
    return this.subforms.filter(s => !alreadyPlaced.has(s.key));
  }
}
