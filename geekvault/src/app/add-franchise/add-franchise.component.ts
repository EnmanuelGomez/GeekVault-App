import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

// Angular Material (standalone)
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }      from '@angular/material/input';
import { MatIconModule }       from '@angular/material/icon';
import { MatButtonModule }     from '@angular/material/button';
import { MatCardModule }       from '@angular/material/card';
import { MatTooltipModule }    from '@angular/material/tooltip';
import { MatSelectModule }     from '@angular/material/select';

import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { CategoryService } from '../core/services/category.service';
import { FranchiseService } from '../core/services/franchise.service';

import { Category } from '../core/models/category.model';
import { Franchise } from '../core/models/franchise.model';
import { FranchiseCreateRequest } from '../core/models/franchise-create.model';
import { FranchiseUpdateRequest } from '../core/models/franchise-update.model';

@Component({
  selector: 'app-add-franchise',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatSelectModule
  ],
  templateUrl: './add-franchise.component.html',
  styleUrls: ['./add-franchise.component.scss']
})
export class AddFranchiseComponent implements OnInit {

  // ------------------------------
  // Estado de imagen (preview / origen)
  // ------------------------------
  /** Imagen de vista previa: puede ser dataURL (base64) o URL remota */
  previewImage: string | null = null;
  /** URL remota elegida (si el usuario pega/arrastra un link) */
  imageUrl: string | null = null;
  /** Archivo local seleccionado (si el usuario sube desde su PC) */
  imageFile: File | null = null;

  // ------------------------------
  // Estados de UI y helpers de entrada
  // ------------------------------
  isDragOver = false;
  urlInput: string = '';
  urlError: string | null = null;
  saving = false;

  // ------------------------------
  // Modelo del formulario (campos del DTO)
  // ------------------------------
  nombre = '';
  /** ISO yyyy-MM-dd (como devuelve <input type="date">) */
  fecha: string | null = null;
  creador = '';
  pais = '';
  resumen = '';

  // ------------------------------
  // Categorías (UI maneja una sola categoría)
  // ------------------------------
  categories: Category[] = [];
  selectedCategoryId: string | null = null;

  // ------------------------------
  // Modo edición
  // ------------------------------
  /** true si estamos en /franchise/:id/edit */
  editMode = false;
  /** id de la franquicia al editar */
  franchiseId: string | null = null;

  // ------------------------------
  // Inyección de dependencias
  // ------------------------------
  private sanitizer = inject(DomSanitizer); // reservado por si luego sanitizamos contenido
  private categoryService = inject(CategoryService);
  private franchiseService = inject(FranchiseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // ------------------------------
  // Ciclo de vida
  // ------------------------------
  ngOnInit(): void {
    this.loadCategories();

    // Detecta si estamos en ruta de edición: /franchise/:id/edit
    // Si solo estás en /franchise/:id (detalle), no cambia a modo edición.
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id && this.router.url.includes('/edit')) {
        this.editMode = true;
        this.franchiseId = id;
        this.loadForEdit(id);
      }
    });
  }

  // ------------------------------
  // Cargas iniciales
  // ------------------------------
  /** Carga catálogos de categorías para el combo */
  private loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (cats) => this.categories = cats ?? [],
      error: () => this.categories = []
    });
  }

  /** Al entrar en modo edición, precarga datos de la franquicia y su categoría actual */
  private loadForEdit(id: string): void {
    // 1) Datos de la franquicia
    this.franchiseService.getById(id).subscribe({
      next: (f: Franchise) => {
        // Mapea DTO de lectura hacia los campos del formulario
        this.nombre  = f.name ?? '';
        this.resumen = f.description ?? '';
        this.pais    = f.originCountry ?? '';
        this.creador = f.founders ?? '';
        // La API devuelve "yyyy-MM-dd" para DateOnly → es compatible con <input type="date">
        this.fecha   = f.foundedOn ?? null;
        // Imagen
        this.imageUrl = f.imageUrl ?? null;
        this.previewImage = this.imageUrl ?? null;
      },
      error: (err) => {
        console.error('[Editar] Error cargando franquicia', err);
        alert('No se pudo cargar la franquicia para edición.');
        this.router.navigate(['/']); // fallback
      }
    });

    // 2) Categoría asociada (UI asume una)
    this.franchiseService.getPrimaryCategory(id).subscribe({
      next: (x) => this.selectedCategoryId = x?.categoryId ?? null,
      error: (err) => {
        console.warn('[Editar] No se pudo determinar la categoría actual', err);
        // No bloqueamos la edición si falla; el usuario puede elegir una.
      }
    });
  }

  // ------------------------------
  // Utilidades de plantilla
  // ------------------------------
  trackCat = (_: number, c: Category) => c.id;

  // ------------------------------
  // Entrada por archivo local
  // ------------------------------
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result; // base64 para previsualizar
        this.imageUrl = null;                // si eligió archivo, limpiamos URL remota
      };
      reader.readAsDataURL(file);
    }
  }

  // ------------------------------
  // Drag & drop (URL o archivo)
  // ------------------------------
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

    // 1) ¿Arrastró ARCHIVOS?
    if (evt.dataTransfer.files && evt.dataTransfer.files.length > 0) {
      const file = evt.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        this.imageFile = file;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewImage = e.target.result;
          this.imageUrl = null;
        };
        reader.readAsDataURL(file);
        return;
      }
    }

    // 2) ¿Arrastró una URL (text/uri-list)?
    const uriList = evt.dataTransfer.getData('text/uri-list');
    if (uriList) {
      const url = uriList.split('\n')[0].trim();
      this.setRemoteUrl(url);
      return;
    }

    // 3) ¿Arrastró HTML con <img>?
    const html = evt.dataTransfer.getData('text/html');
    if (html) {
      const url = this.extractImageUrlFromHtml(html);
      if (url) {
        this.setRemoteUrl(url);
        return;
      }
    }

    // 4) ¿Arrastró texto plano?
    const text = evt.dataTransfer.getData('text/plain');
    if (text && this.looksLikeUrl(text)) {
      this.setRemoteUrl(text.trim());
      return;
    }
  }

  // ------------------------------
  // Pegar (Ctrl+V) URL o imagen
  // ------------------------------
  @HostListener('paste', ['$event'])
  async onPaste(evt: ClipboardEvent): Promise<void> {
    const dt = evt.clipboardData;
    if (!dt) return;

    // a) Imagen del portapapeles
    const items = dt.items;
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (it.type.startsWith('image/')) {
        const blob = it.getAsFile();
        if (blob) {
          this.imageFile = new File([blob], 'pasted-image', { type: blob.type });
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.previewImage = e.target.result;
            this.imageUrl = null;
          };
          reader.readAsDataURL(blob);
          return;
        }
      }
    }

    // b) URL en texto
    const text = dt.getData('text/plain');
    if (text && this.looksLikeUrl(text)) {
      this.setRemoteUrl(text.trim());
      return;
    }
  }

  // ------------------------------
  // URL manual (input)
  // ------------------------------
  onUrlBlur(): void {
    const url = this.urlInput.trim();
    if (!url) {
      this.urlError = null;
      return;
    }
    if (!this.looksLikeUrl(url)) {
      this.urlError = 'URL no válida';
      return;
    }
    this.setRemoteUrl(url);
  }

  // ------------------------------
  // Guardar (crear o actualizar)
  // ------------------------------
  onSubmit(): void {
    // Validación mínima del formulario
    if (!this.nombre || !this.selectedCategoryId) return;

    // Nota: si `imageFile` tiene contenido, normalmente subirías el archivo
    // a un endpoint de storage y usarías la URL pública en `imageUrl`.
    // Por simplicidad, aquí solo enviamos `imageUrl` si existe.

    if (this.editMode && this.franchiseId) {
      // ---------- MODO EDICIÓN: PUT /api/Franchises/{id} ----------
      const payload: FranchiseUpdateRequest = {
        name: this.nombre.trim(),
        description: this.resumen?.trim() || undefined,
        originCountry: this.pais?.trim() || undefined,
        foundedOn: this.fecha || undefined,       // yyyy-MM-dd
        founders: this.creador?.trim() || undefined,
        imageUrl: this.imageUrl || undefined,     // si usaste archivo, aquí iría la URL luego del upload
        categoryId: this.selectedCategoryId
      };

      this.saving = true;
      this.franchiseService.update(this.franchiseId, payload).subscribe({
        next: (updated: Franchise) => {
          console.log('Franquicia actualizada:', updated);
          alert(`Franquicia "${updated.name}" actualizada correctamente`);
          // Navega al detalle tras actualizar
          this.router.navigate(['/franchise', updated.id]);
        },
        error: (err: HttpErrorResponse) => {
          console.error('HTTP ERROR (update)', err.status, err);
          const msg =
            (err.error && (err.error.detail || err.error.title || err.error)) ||
            (err.message ?? 'Error desconocido');
          alert(`Error al actualizar la franquicia: ${msg}`);
        },
        complete: () => (this.saving = false)
      });

    } else {
      // ---------- MODO CREACIÓN: POST /api/Franchises ----------
      const payload: FranchiseCreateRequest = {
        name: this.nombre.trim(),
        description: this.resumen?.trim() || undefined,
        originCountry: this.pais?.trim() || undefined,
        foundedOn: this.fecha || undefined,       // yyyy-MM-dd
        founders: this.creador?.trim() || undefined,
        imageUrl: this.imageUrl || undefined,     // si usaste archivo, aquí iría la URL luego del upload
        categoryId: this.selectedCategoryId
      };

      this.saving = true;
      this.franchiseService.create(payload).subscribe({
        next: (created: Franchise) => {
          console.log('Franquicia creada:', created);
          alert(`Franquicia "${created.name}" creada correctamente`);
          this.resetForm();
        },
        error: (err: HttpErrorResponse) => {
          console.error('HTTP ERROR (create)', err.status, err);
          const msg =
            (err.error && (err.error.detail || err.error.title || err.error)) ||
            (err.message ?? 'Error desconocido');
          alert(`Error al crear la franquicia: ${msg}`);
        },
        complete: () => (this.saving = false)
      });
    }
  }

  // ------------------------------
  // Reset del formulario (tras crear)
  // ------------------------------
  private resetForm(): void {
    this.nombre = '';
    this.fecha = null;
    this.creador = '';
    this.pais = '';
    this.resumen = '';
    this.selectedCategoryId = null;

    this.previewImage = null;
    this.imageUrl = null;
    this.imageFile = null;

    this.urlInput = '';
    this.urlError = null;
  }

  // ------------------------------
  // Helpers de imagen / URL
  // ------------------------------
  private setRemoteUrl(url: string): void {
    this.urlError = null;
    this.imageUrl = url;
    this.imageFile = null;       // si pone URL, descartamos archivo
    this.previewImage = url;     // mostramos la URL como preview
    this.urlInput = url;
  }

  private looksLikeUrl(text: string): boolean {
    try {
      const u = new URL(text);
      return /^https?:$/i.test(u.protocol);
    } catch {
      return false;
    }
  }

  private extractImageUrlFromHtml(html: string): string | null {
    const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (match?.[1]) return match[1];
    const link = html.match(/<a[^>]+href=["']([^"']+)["']/i)?.[1];
    if (link && this.looksLikeUrl(link)) return link;
    return null;
  }
}
