import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Franchise } from '../models/franchise.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FranchiseService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/api/Franchises`; // ← aquí sí agregamos /api

getByCategory(categoryId: string | number) {
  const id = String(categoryId);
  return this.http.get<Franchise[]>(`${this.baseUrl}?categoryId=${encodeURIComponent(id)}`);
}
}
