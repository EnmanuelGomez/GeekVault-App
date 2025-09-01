import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Character } from '../models/character.model';

@Injectable({ providedIn: 'root' })
export class CharacterService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/api/Characters`;

  getByFranchise(franchiseId: string): Observable<Character[]> {
    return this.http.get<Character[]>(`${this.baseUrl}/by-franchise/${encodeURIComponent(franchiseId)}`);
  }
}
