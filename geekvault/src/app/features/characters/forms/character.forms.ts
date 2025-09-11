import { FormArray, FormBuilder, FormControl, FormGroup, Validators, NonNullableFormBuilder } from '@angular/forms';

export function createCharacterForm(fb: NonNullableFormBuilder, currentYear: number) {
  return fb.group({
    // formulario principal
    name: fb.control('', { validators: [Validators.required, Validators.minLength(2)] }),
    alias: fb.control('', { validators: [Validators.required, Validators.minLength(2)] }),
    // En character.forms.ts
    categories: fb.control<string[]>([], { validators: [Validators.required, Validators.minLength(1)] }),
    universe: fb.control('', { validators: [Validators.required] }),
    creator: fb.control('', { validators: [Validators.required] }),
    yearCreated: fb.control(currentYear, { validators: [Validators.required, Validators.min(1895), Validators.max(currentYear)] }),
    summary: fb.control(''),
    imageFile: fb.control<File | null>(null),
    // anexos (inicializados para que los subforms “encajen” sin romper)
    subforms: fb.group({
      firstAppearance: createFirstAppearanceForm(fb),
      powers: fb.array([]), // empieza con uno; puedes dejar [] si quieres
      stats: createStatsForm(fb),
      versions: fb.array([]),
    })
  });
}

// Factories reutilizables (permite mantener consistencia en todos los formularios)
export function createFirstAppearanceForm(fb: NonNullableFormBuilder) {
  return fb.group({
    imageFile: fb.control<File | null>(null),
    title: fb.control('', { validators: [Validators.required, Validators.minLength(2)] }),
    medium: fb.control<'comic'|'tv'|'movie'|'game'|'anime'|'novel'|'other'>('comic', { validators: [Validators.required] }),
    issueOrEpisode: fb.control<string>(''),
    publisherOrStudio: fb.control<string>(''),
    date: fb.control<string>(''), // ISO
    notes: fb.control<string>(''),
  });
}

export function createPowerForm(fb: NonNullableFormBuilder) {
  return fb.group({
    name: fb.control('', [Validators.required, Validators.minLength(2)]),
    description: fb.control('')
  });
}

export function createStatsForm(fb: NonNullableFormBuilder) {
  const scale = [Validators.required, Validators.min(1), Validators.max(10)];
  return fb.group({
    strength: fb.control(5, { validators: scale }),
    speed: fb.control(5, { validators: scale }),
    skills: fb.control(5, { validators: scale }),
    weapons: fb.control(5, { validators: scale }),
    intelligence: fb.control(5, { validators: scale }),
    durability: fb.control(5, { validators: scale }),
    endurance: fb.control(5, { validators: scale }),
    experience: fb.control(5, { validators: scale }),
    fighting: fb.control(5, { validators: scale }),
    power: fb.control(5, { validators: scale }),
  });
}

export function createVersionForm(fb: NonNullableFormBuilder) {
  return fb.group({
    imageFile: fb.control<File | null>(null),
    title: fb.control('', { validators: [Validators.required, Validators.minLength(2)] }),
    medium: fb.control<'comic'|'tv'|'movie'|'game'|'anime'|'novel'|'other'>('comic', { validators: [Validators.required] }),
    continuity: fb.control<string>(''),
    firstAppearanceRef: fb.control<string>(''),
    createdBy: fb.control<string>(''),
  });
}
