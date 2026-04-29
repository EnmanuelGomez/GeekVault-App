// core/services/character.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Character } from '../models/character.model';
import { CharacterType } from '../models/character-type.model';
import { Franchise } from '../models/franchise.model';
import { MOCK_CHARACTERS, MOCK_FRANCHISES, MOCK_CATEGORIES } from '../mocks/mock-data';
import { of } from 'rxjs';

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
    return of(MOCK_CHARACTERS.filter(c => c.franchiseId === franchiseId) as Character[]);
  }

  /** Obtener franquicia mediante id **/
  getFranchiseById(id: string): Observable<Franchise> {
    const franchise = MOCK_FRANCHISES.find(f => f.id === Number(id));
    return of(franchise as Franchise);
  }

  /** Detalle por id con merge de extraData (si existe y es JSON válido). */
  getById(id: string): Observable<CharacterDetail> {
    const character = MOCK_CHARACTERS.find(c => c.id === id);
    return of(character as CharacterDetail);
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
    return of(MOCK_CATEGORIES);
  }

  /** Crear personaje (mock) */
  create(payload: any): Observable<any> {
    const newCharacter = { id: `char-${Date.now()}`, ...payload };
    return of(newCharacter);
  }
}
