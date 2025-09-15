import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Franchise } from '../models/franchise.model';
import { environment } from '../../../environments/environment';
import { FranchiseCreateRequest } from '../models/franchise-create.model';

@Injectable({ providedIn: 'root' })
export class FranchiseService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/api/Franchises`;

getAll(): Observable<Franchise[]> {
  return this.http.get<Franchise[]>(this.baseUrl);
}

getByCategory(categoryId: string | number) {
  const id = String(categoryId);
  return this.http.get<Franchise[]>(`${this.baseUrl}?categoryId=${encodeURIComponent(id)}`);
}

getById(id: string) {
  return this.http.get<Franchise>(`${this.baseUrl}/${encodeURIComponent(id)}`);
}

create(payload: FranchiseCreateRequest): Observable<Franchise> {
  return this.http.post<Franchise>(this.baseUrl, payload);
}

}
