import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-stats-subform',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsSubformComponent {
  @Input({ required: true }) group!: FormGroup;
  labels = [
    { key: 'strength', label: 'Fuerza' },
    { key: 'speed', label: 'Velocidad' },
    { key: 'skills', label: 'Habilidades' },
    { key: 'intelligence', label: 'Inteligencia' },
    { key: 'durability', label: 'Durabilidad' },
    { key: 'endurance', label: 'Resistencia' },
    { key: 'experience', label: 'Experiencia' },
    { key: 'fighting', label: 'Combate' },
    { key: 'power', label: 'Poder' },
  ] as const;
}
