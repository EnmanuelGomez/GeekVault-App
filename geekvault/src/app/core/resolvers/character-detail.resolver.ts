import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { CharacterService } from '../services/character.service';

export const characterResolver: ResolveFn<any> = (route) => {
  const id = route.paramMap.get('id')!;
  return inject(CharacterService).getById(id);
};
