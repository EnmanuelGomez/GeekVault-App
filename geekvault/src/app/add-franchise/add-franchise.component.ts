import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

// Angular Material (standalone)
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }      from '@angular/material/input';
import { MatIconModule }       from '@angular/material/icon';
import { MatButtonModule }     from '@angular/material/button';
import { MatCardModule }       from '@angular/material/card';
import { MatTooltipModule }    from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';

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
    MatTooltipModule
  ],
  templateUrl: './add-franchise.component.html',
  styleUrls: ['./add-franchise.component.scss']
})
export class AddFranchiseComponent {
  // Preview que se muestra en el header (puede ser URL remota o base64 local)
  previewImage: string | null = null;

  // Fuente remota elegida (lo que quieres guardar si viene de la web)
  imageUrl: string | null = null;

  // Archivo local seleccionado (si el usuario sube desde su PC)
  imageFile: File | null = null;

  // Estados UI
  isDragOver = false;
  urlInput: string = '';
  urlError: string | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  // ==== Entrada por archivo local ====
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

  // ==== Drag & drop (URL o archivo) ====
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

    // 3) ¿Arrastró texto/HTML que contiene una <img>?
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

  // ==== Pegar (Ctrl+V) URL o imagen ====
  @HostListener('paste', ['$event'])
  async onPaste(evt: ClipboardEvent): Promise<void> {
    const dt = evt.clipboardData;
    if (!dt) return;

    // a) ¿Imagen en el portapapeles?
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

    // b) ¿URL en texto?
    const text = dt.getData('text/plain');
    if (text && this.looksLikeUrl(text)) {
      this.setRemoteUrl(text.trim());
      return;
    }
  }

  // ==== URL manual (input) ====
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

  // ==== Guardar ====
  onSubmit(): void {
    // Regla: si hay URL, guardar esa dirección.
    // Si no hay URL pero hay archivo local, aquí normalmente subirías y obtendrías una URL.
    // Por simplicidad, dejamos el base64 como preview y un TODO para el upload real.
    let valueToSave: string | null = null;

    if (this.imageUrl) {
      valueToSave = this.imageUrl;
    } else if (this.imageFile) {
      // TODO: reemplaza por upload real y usar la URL que retorne tu backend/CDN.
      valueToSave = this.previewImage; // temporal (base64)
    }

    // Aquí disparas tu lógica de guardado (servicio/HTTP, form, etc.)
    console.log('Guardando imagen:', valueToSave);
    alert(`Imagen guardada:\n${valueToSave ?? 'Ninguna'}`);
  }

  // ==== Helpers ====
  private setRemoteUrl(url: string): void {
    this.urlError = null;
    this.imageUrl = url;
    this.imageFile = null;
    this.previewImage = url; // usamos la URL como preview directamente
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
    // Intenta parsear un <img src="...">
    const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
    if (match?.[1]) return match[1];
    // A veces te pasan un <a href="..."> hacia una imagen
    const link = html.match(/<a[^>]+href=["']([^"']+)["']/i)?.[1];
    if (link && this.looksLikeUrl(link)) return link;
    return null;
    }
}
