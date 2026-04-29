import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Franchise } from '../models/franchise.model';
import { environment } from '../../../environments/environment';
import { MOCK_FRANCHISES } from '../mocks/mock-data';
import { FranchiseCreateRequest } from '../models/franchise-create.model';
import { FranchiseUpdateRequest } from '../models/franchise-update.model';

@Injectable({ providedIn: 'root' })
export class FranchiseService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/api/Franchises`;

getAll(): Observable<Franchise[]> {
  return of(MOCK_FRANCHISES as Franchise[]);
}

getByCategory(categoryId: string | number): Observable<Franchise[]> {
  const idNum = Number(categoryId);
  return of((MOCK_FRANCHISES as Franchise[]).filter(f => (f as any).categoryId === idNum || (f as any).categoryId === categoryId));
}

getById(id: string) {
  return of((MOCK_FRANCHISES as Franchise[]).find(f => String(f.id) === String(id)) as Franchise);
}

create(payload: FranchiseCreateRequest): Observable<Franchise> {
  return this.http.post<Franchise>(this.baseUrl, payload);
}

// actualizar
update(id: string, payload: FranchiseUpdateRequest) {
  return this.http.put<Franchise>(`${this.baseUrl}/${encodeURIComponent(id)}`, payload);
}

  // obtener la categoría actual (UI maneja una)
getPrimaryCategory(franchiseId: string) {
  return this.http.get<{ categoryId: string | null }>(`${this.baseUrl}/${encodeURIComponent(franchiseId)}/category`);
}

}
