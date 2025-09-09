// core/services/character.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Character } from '../models/character.model';
import { CharacterType } from '../models/character-type.model';
import { Franchise } from '../models/franchise.model';

// Tipado opcional del detalle (extiende el base con posibles extras)
export type CharacterDetail = Character & {
  firstAppearance?: {
    medium: 'comic' | 'tv' | 'movie' | 'game' | 'anime' | 'novel' | 'other';
    title: string;
    issueOrEpisode?: string;
    publisherOrStudio?: string;
    date?: string;
    notes?: string;
  };
  powers?: { name: string; description?: string }[];
  stats?: {
    strength: number; speed: number; skills: number; weapons: number;
    intelligence: number; durability: number; endurance: number;
    experience: number; fighting: number; power: number;
  };
  // Puedes agregar aquí otros anexos futuros (teams, allies, etc.)
};

@Injectable({ providedIn: 'root' })
export class CharacterService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/api/Characters`;
  private categoriesBaseUrl = `${environment.apiBaseUrl}/api/CharacterCharacterTypes`;
  private franchiseBaseUrl = `${environment.apiBaseUrl}/api/Franchises`;

  /** Lista por franquicia */
  getByFranchise(franchiseId: string): Observable<Character[]> {
    return this.http.get<Character[]>(
      `${this.baseUrl}/by-franchise/${encodeURIComponent(franchiseId)}`
    );
  }

  /** Obtener franquicia mediante id **/
  getFranchiseById(id: string): Observable<Franchise> {
    return this.http.get<Franchise>(`${this.franchiseBaseUrl}/${encodeURIComponent(id)}`);
  }

  /** Detalle por id con merge de extraData (si existe y es JSON válido). */
  getById(id: string): Observable<CharacterDetail> {
    return this.http
      .get<Character>(`${this.baseUrl}/${encodeURIComponent(id)}`)
      .pipe(map((c) => this.mergeExtras(c)));
  }

  /** Utilidad: combina extraData (string u objeto) sobre el Character base. */
  private mergeExtras(c: Character): CharacterDetail {
    const ed = c.extraData;

    // Si el backend ya devuelve extraData como objeto (no string)
    if (ed && typeof ed === 'object') {
      return { ...(c as CharacterDetail), ...(ed as Record<string, unknown>) };
    }

    // Si viene como string JSON
    if (typeof ed === 'string' && ed.trim().length > 0) {
      try {
        const parsed = JSON.parse(ed);
        return { ...(c as CharacterDetail), ...(parsed as Record<string, unknown>) };
      } catch {
        // Si falla el parse, devolvemos el objeto base
        return c as CharacterDetail;
      }
    }

    // Sin extras
    return c as CharacterDetail;
  }

  // categorías del personaje
  getCategoriesByCharacter(id: string): Observable<CharacterType[]> {
  return this.http
    .get<any[]>(
      `${this.categoriesBaseUrl}/character/${encodeURIComponent(id)}/categories`
    )
    .pipe(
      map((arr) => {
        const list = Array.isArray(arr) ? arr : [];
        // Normaliza: soporta {id,name}, {characterTypeId,typeName}, {characterType:{id,name}}, etc.
        const norm = list.map((x) => {
          const id =
            x?.id ??
            x?.characterTypeId ??
            x?.typeId ??
            x?.characterType?.id ??
            x?.type?.id;

          const name =
            x?.name ??
            x?.typeName ??
            x?.characterType?.name ??
            x?.type?.name;

          return { id, name } as CharacterType;
        });

        // filtra solo válidos
        return norm.filter((c) => c.id && c.name);
      })
    );
}
}
