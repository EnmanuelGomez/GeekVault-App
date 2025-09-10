import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot } from '@angular/router';
import { FranchiseService } from '../services/franchise.service';
import { CharacterService } from '../services/character.service';
import { of, combineLatest } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

export interface FranchiseDetailVM {
  franchise: any | null;
  characters: any[];
}

export const franchiseDetailResolver: ResolveFn<FranchiseDetailVM> = (route: ActivatedRouteSnapshot) => {
  const franchiseSvc = inject(FranchiseService);
  const characterSvc = inject(CharacterService);
  const id = route.paramMap.get('id')!;

  return combineLatest({
    franchise: franchiseSvc.getById(id).pipe(catchError(() => of(null))),
    characters: characterSvc.getByFranchise(id).pipe(catchError(() => of([])))
  }).pipe(
    take(1), // <- clave para streams que no completan
    map(({ franchise, characters }) => ({ franchise, characters }))
  );
};
