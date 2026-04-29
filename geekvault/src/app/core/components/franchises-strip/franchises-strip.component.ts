import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  inject,
} from '@angular/core';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { FranchiseService } from '../../services/franchise.service';
import { Franchise } from '../../models/franchise.model';
import { FranchiseCardComponent } from '../franchise-card/franchise-card.component';

/**
 * Tira horizontal de franquicias sin controles de flechas.
 * - Desplazamiento con scroll horizontal nativo (mouse/touch/trackpad).
 * - Fades en los bordes que se ajustan según posición (inicio/fin).
 * - No aumenta el scroll vertical de la página.
 */
@Component({
  selector: 'app-franchises-strip',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, RouterLink, FranchiseCardComponent],
  templateUrl: './franchises-strip.component.html',
  styleUrls: ['./franchises-strip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FranchisesStripComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  private franchiseSrv = inject(FranchiseService);

  /** Categoría a consultar (requerida) */
  @Input({ required: true }) categoryId!: string | number;

  /** Flujo de franquicias para el template */
  franchises$!: Observable<Franchise[]>;

  /** Referencia al carril desplazable */
  @ViewChild('scroller', { static: false })
  scrollerRef?: ElementRef<HTMLDivElement>;

  /** Estado visual de la tira (sin botones, solo para clases/fades) */
  atStart = true;
  atEnd = true;
  hasOverflow = false;

  /** Observa cambios de tamaño del carril para recalcular fades/overflow */
  private ro?: ResizeObserver;

  ngOnInit(): void {
    this.franchises$ = this.franchiseSrv.getByCategory(this.categoryId).pipe(
      // Cuando llega data, programamos un primer chequeo de fades
      tap(() => queueMicrotask(() => this.updateEdges()))
    );
  }

  ngAfterViewInit(): void {
    const el = this.scrollerRef?.nativeElement;
    if (el && typeof ResizeObserver !== 'undefined') {
      this.ro = new ResizeObserver(() => this.updateEdges());
      this.ro.observe(el);
    }
    // Recalcular por si imágenes o fuentes cargan después
    setTimeout(() => this.updateEdges(), 80);
    setTimeout(() => this.updateEdges(), 400);
  }

  ngOnDestroy(): void {
    this.ro?.disconnect();
  }

  /** Handler de scroll del carril */
  onScroll(): void {
    this.updateEdges();
  }

  /**
   * Recalcula:
   *  - si hay overflow horizontal,
   *  - si estamos al inicio/fin,
   *  - y actualiza variables CSS para los fades.
   */
  private updateEdges(): void {
    const el = this.scrollerRef?.nativeElement;
    if (!el) {
      this.hasOverflow = false;
      this.atStart = true;
      this.atEnd = true;
      return;
    }

    const max = Math.max(0, el.scrollWidth - el.clientWidth);
    this.hasOverflow = max > 1;

    const left = el.scrollLeft;
    const near = 2; // tolerancia

    this.atStart = !this.hasOverflow || left <= near;
    this.atEnd = !this.hasOverflow || left >= (max - near);

    // Variables CSS consumidas por la máscara de fades (ver SCSS)
    el.style.setProperty('--fade-left', this.atStart ? '0px' : '64px');
    el.style.setProperty('--fade-right', this.atEnd ? '0px' : '64px');
  }

  /** trackBy para listas largas */
  trackById = (_: number, it: Franchise) => it.id;
}
