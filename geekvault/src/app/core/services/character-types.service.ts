import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CharacterType } from '../models/character-types.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CharacterTypesService {
 private http = inject(HttpClient);
   private baseUrl = `${environment.apiBaseUrl}/api/CharacterCategory`;

   getAll(): Observable<CharacterType[]> {
     return this.http.get<CharacterType[]>(this.baseUrl);
   }
}
