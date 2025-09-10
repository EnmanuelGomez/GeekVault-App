// core/resolvers/character-detail.resolver.ts
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CharacterService, CharacterDetail } from '../services/character.service';

export const characterResolver: ResolveFn<CharacterDetail | null> = (route: ActivatedRouteSnapshot) => {
  const id = route.paramMap.get('id')!;
  const svc = inject(CharacterService);
  return svc.getById(id).pipe(
    catchError(err => {
      console.error('characterResolver error', err);
      return of(null); // <- no canceles la navegación
    })
  );
};
