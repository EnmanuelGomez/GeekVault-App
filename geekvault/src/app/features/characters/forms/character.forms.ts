import { FormArray, FormBuilder, FormControl, FormGroup, Validators, NonNullableFormBuilder } from '@angular/forms';

// Factories reutilizables (permite mantener consistencia en todos los formularios)
export function createFirstAppearanceForm(fb: NonNullableFormBuilder) {
  return fb.group({
    medium: fb.control<'comic'|'tv'|'movie'|'game'|'anime'|'novel'|'other'>('comic', { validators: [Validators.required] }),
    title: fb.control('', { validators: [Validators.required, Validators.minLength(2)] }),
    issueOrEpisode: fb.control<string>(''),
    publisherOrStudio: fb.control<string>(''),
    date: fb.control<string>(''), // ISO
    notes: fb.control<string>(''),
  });
}

export function createPowerAbilityForm(fb: NonNullableFormBuilder) {
  return fb.group({
    name: fb.control('', { validators: [Validators.required] }),
    type: fb.control<'innate'|'tech'|'magic'|'training'>('innate', { validators: [Validators.required] }),
    description: fb.control<string>(''),
    level: fb.control<number | null>(null, { validators: [Validators.min(1), Validators.max(10)] }),
  });
}

export function createStatsForm(fb: NonNullableFormBuilder) {
  const scale = [Validators.required, Validators.min(1), Validators.max(7)];
  return fb.group({
    strength: fb.control(3, { validators: scale }),
    speed: fb.control(3, { validators: scale }),
    intelligence: fb.control(3, { validators: scale }),
    durability: fb.control(3, { validators: scale }),
    energy: fb.control(3, { validators: scale }),
    fighting: fb.control(3, { validators: scale }),
  });
}

export function createCharacterForm(fb: NonNullableFormBuilder, currentYear: number) {
  return fb.group({
    // formulario principal
    name: fb.control('', { validators: [Validators.required, Validators.minLength(2)] }),
    universe: fb.control('', { validators: [Validators.required] }),
    creator: fb.control('', { validators: [Validators.required] }),
    yearCreated: fb.control(currentYear, { validators: [Validators.required, Validators.min(1895), Validators.max(currentYear)] }),
    summary: fb.control(''),
    imageFile: fb.control<File | null>(null),
    // anexos (inicializados para que los subforms “encajen” sin romper)
    subforms: fb.group({
      firstAppearance: createFirstAppearanceForm(fb),
      powers: fb.array([ createPowerAbilityForm(fb) ]), // empieza con uno; puedes dejar [] si quieres
      stats: createStatsForm(fb),
      // Agrega aquí los demás: teams, allies, rivals, versions, adaptations, weaknesses, equipment, rankings, merchandise, media, publisher...
    })
  });
}
