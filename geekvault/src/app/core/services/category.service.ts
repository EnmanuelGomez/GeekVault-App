import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category.model';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MOCK_CATEGORIES } from '../mocks/mock-data';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/api/Categories`;

  getAll(): Observable<Category[]> {
    return of(MOCK_CATEGORIES as Category[]);
  }

  getById(id: string): Observable<Category> {
    const cat = MOCK_CATEGORIES.find(c => c.id === id);
    return of((cat || MOCK_CATEGORIES[0]) as Category);
  }

  create(category: any): Observable<Category> {
    return of({ id: Math.random().toString(), ...category } as Category);
  }

  update(id: string, category: any): Observable<Category> {
    return of({ id, ...category } as Category);
  }

  delete(id: string): Observable<void> {
    return of(undefined);
  }
}
