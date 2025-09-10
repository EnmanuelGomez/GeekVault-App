import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';

import { Category } from '../core/models/category.model';
import { CategoryService } from '../core/services/category.service';
import { FranchisesStripComponent } from '../core/components/franchises-strip/franchises-strip.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,               // NgIf, NgFor, AsyncPipe
    FranchisesStripComponent
  ],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
[x: string]: any;
  private categorySvc = inject(CategoryService);

  loading = true;
  error: string | null = null;

  categories$: Observable<Category[]> = this.categorySvc.getAll().pipe(
    tap(() => {
      this.loading = false;
      this.error = null;
    }),
    catchError(err => {
      console.error('[LandingPage] Error cargando categorías', err);
      this.loading = false;
      this.error = 'No se pudieron cargar las categorías.';
      return of([] as Category[]);
    }),
    shareReplay(1)
  );

  trackByCatId = (_: number, item: Category) => item.id;
}
