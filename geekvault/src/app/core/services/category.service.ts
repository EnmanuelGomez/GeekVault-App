import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category, CategoryCreateRequest, CategoryUpdateRequest } from '../models/category.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/api/Categories`;

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }
   getById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/${id}`);
  }
  //POST
  create(dto: CategoryCreateRequest): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, dto);
  }
  // PUT
  update(id: string, dto: CategoryUpdateRequest): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/${id}`, dto);
  }
  // DELETE
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
