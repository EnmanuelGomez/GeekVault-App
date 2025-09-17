import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CharacterType, CharacterTypeCreateRequest, CharacterTypeUpdateRequest, CharacterTypeUpdateRequestWithId } from '../models/character-type.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CharacterTypesService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/api/CharacterCategory`;

  getAll(): Observable<CharacterType[]> {
    return this.http.get<CharacterType[]>(this.baseUrl);
  }

  getById(id: string | number): Observable<CharacterType> {
    return this.http.get<CharacterType>(`${this.baseUrl}/${id}`);
  }

  create(dto: CharacterTypeCreateRequest): Observable<CharacterType> {
    return this.http.post<CharacterType>(this.baseUrl, dto);
  }

  update(id: string | number, dto: CharacterTypeUpdateRequestWithId): Observable<CharacterType> {
    return this.http.put<CharacterType>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
