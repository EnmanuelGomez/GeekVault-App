// add-character.component.ts
// ==============================================
// Componente: Agregar Personaje
// - Carga tipos de personaje desde API
// - Permite seleccionar múltiples categorías (IDs tipo string)
// - Muestra chips removibles
// - Renderiza subforms dinámicos (firstAppearance, powers, stats)
// ==============================================

import { Component, DestroyRef, Type, inject, signal, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';

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
import { CharacterService } from '../core/services/character.service';
import { Router } from '@angular/router';
import { CreateCharacterRequest } from '../core/models/character-create.model';

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
  private characterSvc = inject(CharacterService);
  private router = inject(Router);

  isSubmitting = false;
  apiError: string | null = null;
  apiSuccess = false;        // feedback de éxito visible
  triedSubmit = false;       // muestra avisos tras intentar enviar

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

  // Estados de URL/drag&drop
  isDragOver = false;
  urlInput = '';
  urlError: string | null = null;

  // ----------------------------------------------
  // Ciclo de vida: cargar catálogo de categorías y franquicias
  // ----------------------------------------------
  ngOnInit(): void {
    // ✅ Garantizamos que "fecha de creación" (yearCreated) sea obligatoria
    this.f['yearCreated'].addValidators(Validators.required);
    this.f['yearCreated'].updateValueAndValidity({ emitEvent: false });

    // ✅ Garantizamos que haya al menos 1 categoría
    this.f['categories'].addValidators(Validators.minLength(1));
    this.f['categories'].updateValueAndValidity({ emitEvent: false });

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
    this.form.patchValue({ imageFile: file, imageUrl: null });

    const prev = this.imagePreview();
    if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);

    const url = URL.createObjectURL(file);
    this.imagePreview.set(url);

    // limpiar posibles errores de URL
    this.urlInput = '';
    this.urlError = null;

    this.destroyRef.onDestroy(() => URL.revokeObjectURL(url));
  }

  clearImage() {
    const prev = this.imagePreview();
    if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);
    this.imagePreview.set(null);
    this.form.patchValue({ imageFile: null, imageUrl: null });
    this.urlInput = '';
    this.urlError = null;
  }

   // ========== DRAG & DROP (archivo o URL) ==========
  onDragOver(evt: DragEvent): void {
    evt.preventDefault();
    this.isDragOver = true;
  }
  onDragLeave(): void {
    this.isDragOver = false;
  }
  async onDrop(evt: DragEvent): Promise<void> {
    evt.preventDefault();
    this.isDragOver = false;
    if (!evt.dataTransfer) return;

    // 1) Archivos
    if (evt.dataTransfer.files && evt.dataTransfer.files.length > 0) {
      const file = evt.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        // reutiliza onFileSelected logic
        const dt = new DataTransfer();
        dt.items.add(file);
        const fakeInput = { files: dt.files } as unknown as HTMLInputElement;
        this.onFileSelected({ target: fakeInput } as any);
        return;
      }
    }

    // 2) URL directa (text/uri-list)
    const uriList = evt.dataTransfer.getData('text/uri-list');
    if (uriList) {
      const url = uriList.split('\n')[0].trim();
      this.setRemoteUrl(url);
      return;
    }

    // 3) HTML con <img>
    const html = evt.dataTransfer.getData('text/html');
    if (html) {
      const url = this.extractImageUrlFromHtml(html);
      if (url) { this.setRemoteUrl(url); return; }
    }

    // 4) Texto plano con URL
    const text = evt.dataTransfer.getData('text/plain');
    if (text && this.looksLikeUrl(text)) {
      this.setRemoteUrl(text.trim());
    }
  }

  // ========== PEGAR (Ctrl+V) imagen o URL ==========
  @HostListener('paste', ['$event'])
  async onPaste(evt: ClipboardEvent): Promise<void> {
    const dt = evt.clipboardData;
    if (!dt) return;

    // imagen del portapapeles
    for (let i = 0; i < dt.items.length; i++) {
      const it = dt.items[i];
      if (it.type.startsWith('image/')) {
        const blob = it.getAsFile();
        if (blob) {
          const file = new File([blob], 'pasted-image', { type: blob.type });
          const dt2 = new DataTransfer();
          dt2.items.add(file);
          const fakeInput = { files: dt2.files } as unknown as HTMLInputElement;
          this.onFileSelected({ target: fakeInput } as any);
          return;
        }
      }
    }

    // URL en texto
    const text = dt.getData('text/plain');
    if (text && this.looksLikeUrl(text)) {
      this.setRemoteUrl(text.trim());
    }
  }

  // ========== URL (input) ==========
  onUrlBlur(): void {
    const url = this.urlInput.trim();
    if (!url) { this.urlError = null; return; }
    if (!this.looksLikeUrl(url)) { this.urlError = 'URL no válida'; return; }
    this.setRemoteUrl(url);
  }

  // Helpers URL/preview
  private setRemoteUrl(url: string): void {
    this.urlError = null;

    // liberar blob previo si lo hubiera
    const prev = this.imagePreview();
    if (prev && prev.startsWith('blob:')) URL.revokeObjectURL(prev);

    // set form
    this.form.patchValue({ imageUrl: url, imageFile: null });

    // preview con la propia URL
    this.imagePreview.set(url);
    this.urlInput = url;
  }

  private looksLikeUrl(text: string): boolean {
    try {
      const u = new URL(text);
      return /^https?:$/i.test(u.protocol);
    } catch { return false; }
  }

  private extractImageUrlFromHtml(html: string): string | null {
    const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (match?.[1]) return match[1];
    const link = html.match(/<a[^>]+href=["']([^"']+)["']/i)?.[1];
    if (link && this.looksLikeUrl(link)) return link;
    return null;
  }

  // ----------------------------------------------
  // Getters / helpers de formulario
  // ----------------------------------------------
  get f() { return this.form.controls; }

  // ✅ Habilitación del botón: únicamente con campos obligatorios completos
  //    (Nombre, Alias, Año de creación, Creador(es), Franquicia y ≥1 Categoría).
  //    Úsalo en el template como: [disabled]="!canSubmit() || isSubmitting"
  canSubmit(): boolean {
    const nameOk = (this.f['name'].value ?? '').toString().trim().length >= 2;
    const aliasOk = (this.f['alias'].value ?? '').toString().trim().length >= 2;
    const creatorOk = (this.f['creator'].value ?? '').toString().trim().length > 0;
    const franchiseOk = !!(this.f['franchiseId'].value ?? '').toString().trim();
    const year = Number(this.f['yearCreated'].value);
    const yearOk = Number.isFinite(year) && year >= 1895 && year <= this.currentYear;
    const cats: string[] = this.f['categories'].value ?? [];
    const categoriesOk = Array.isArray(cats) && cats.length >= 1;

    return nameOk && aliasOk && creatorOk && franchiseOk && yearOk && categoriesOk;
  }

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
    // Marcamos intento y limpiamos avisos previos
    this.triedSubmit = true;
    this.apiError = null;
    this.apiSuccess = false;

    // ✅ Solo bloqueamos si los campos obligatorios no están OK,
    //    independientemente de validaciones opcionales de subforms.
    if (!this.canSubmit()) {
      // Enfatiza los controles claves
      this.f['name'].markAsTouched();
      this.f['alias'].markAsTouched();
      this.f['creator'].markAsTouched();
      this.f['franchiseId'].markAsTouched();
      this.f['yearCreated'].markAsTouched();
      this.f['categories'].markAsTouched();

      // Llevar foco al primer requerido faltante
      queueMicrotask(() => {
        const firstInvalid = document.querySelector(
          '#name.ng-invalid, #alias.ng-invalid, #creator.ng-invalid, #franchiseId.ng-invalid, #yearCreated.ng-invalid, #categories.ng-invalid'
        ) as HTMLElement | null;
        firstInvalid?.focus();
        firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      return;
    }

    this.isSubmitting = true;

    const v = this.form.getRawValue();

    const payload: CreateCharacterRequest = {
      name: v.name?.trim(),
      alias: v.alias?.trim() || null,
      description: v.summary?.trim() || null,   // summary -> description (backend)
      createdOn: v.yearCreated ?? null,         // año de creación
      createdBy: v.creator?.trim() || null,
      franchiseId: v.franchiseId,               // GUID en string
      imageUrl: v.imageUrl || null,             // si hay URL; imageFile se ignora aquí
      characterTypeIds: (v.categories ?? []).map(String),
      extraData: this.buildExtraData()          // sólo plantillas colocadas y con datos
    };

    this.characterSvc.create(payload).subscribe({
      next: (created) => {
        // Limpia y muestra éxito
        this.resetForm();
        this.apiSuccess = true;
        // this.router.navigate(['/characters', created.id]); // opcional
        console.log('Creado', created);
      },
      error: (err) => {
        console.error(err);
        const msg = err?.error?.detail || err?.error?.title || err?.error?.error || err?.message;
        this.apiError = (typeof msg === 'string' && msg.trim().length > 0)
          ? msg
          : 'Error creando el personaje.';
      },
      complete: () => (this.isSubmitting = false),
    });
  }

  // MANEJO DE PLANTILLAS EXTRAS EN EL GUARDADO
  private buildExtraData() {
    const s = this.form.get('subforms') as FormGroup;
    const placed = this.placed;

    const include = (key: SubformKey) =>
      placed.left.includes(key) || placed.right.includes(key) || placed.bottom.includes(key);

    const out: any = {};

    // firstAppearance
    if (include('firstAppearance')) {
      const fa = s.get('firstAppearance')!.value;
      if ((fa?.title ?? '').trim().length > 0 || fa?.date || fa?.publisherOrStudio || fa?.issueOrEpisode || fa?.notes) {
        out.firstAppearance = {
          title: fa.title?.trim(),
          medium: fa.medium,
          issueOrEpisode: fa.issueOrEpisode || undefined,
          publisherOrStudio: fa.publisherOrStudio || undefined,
          date: fa.date || undefined,
          notes: fa.notes || undefined,
          // imageUrl: cuando tengas uploader, asigna aquí la URL pública
        };
      }
    }

    // powers
    if (include('powers')) {
      const arr = (s.get('powers') as any)?.value as Array<{ name: string; description?: string }>;
      const cleaned = (arr || [])
        .map(p => ({ name: (p?.name ?? '').trim(), description: (p?.description ?? '').trim() || undefined }))
        .filter(p => p.name.length > 0);
      if (cleaned.length > 0) out.powers = cleaned;
    }

    // stats
    if (include('stats')) {
      const stats = s.get('stats')!.value;
      out.stats = {
        strength: stats.strength, speed: stats.speed, skills: stats.skills, weapons: stats.weapons,
        intelligence: stats.intelligence, durability: stats.durability, endurance: stats.endurance,
        experience: stats.experience, fighting: stats.fighting, power: stats.power
      };
    }

    // versions
    if (include('versions')) {
      const versions = (s.get('versions') as any)?.value as Array<any>;
      const cleaned = (versions || [])
        .map(v => ({
          title: (v?.title ?? '').trim(),
          medium: v?.medium,
          continuity: (v?.continuity ?? '').trim() || undefined,
          firstAppearanceRef: (v?.firstAppearanceRef ?? '').trim() || undefined,
          createdBy: (v?.createdBy ?? '').trim() || undefined,
          // imageUrl: cuando tengas uploader
        }))
        .filter(v => v.title.length > 0);
      if (cleaned.length > 0) out.versions = cleaned;
    }

    return Object.keys(out).length > 0 ? out : null;
  }

  // Reset formulario
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
    // limpiar flags de UI
    this.triedSubmit = false;
    this.apiError = null;
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
