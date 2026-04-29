import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoryService} from '../../../core/services/category.service';
import { finalize } from 'rxjs';
import { CategoryUpdateRequest } from '../../../core/models/category.model';

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private svc = inject(CategoryService);

  form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['']
  });

  id = '';
  loading = true;
  saving = false;
  error = '';
  success = '';

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.svc.getById(this.id).subscribe({
      next: cat => {
        this.form.patchValue({
          name: cat.name,
          description: cat.description ?? ''
        });
        this.loading = false;
      },
      error: err => {
        console.error('[EditCategory] error getById', err);
        this.error = 'No se pudo cargar la categoría.';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    this.error = '';
    this.success = '';
    if (this.form.invalid) return;

    const payload: CategoryUpdateRequest = {
      name: this.form.value.name.trim(),
      description: this.form.value.description?.trim() || null
    };

    this.saving = true;
    this.svc.update(this.id, payload)
      .pipe(finalize(() => this.saving = false))
      .subscribe({
        next: updated => {
          this.success = `Guardado: ${updated.name}`;
        },
        error: err => {
          const msg = err?.error?.message || err?.message || 'No se pudo guardar.';
          this.error = msg;
        }
      });
  }

  get name() { return this.form.get('name'); }
}
