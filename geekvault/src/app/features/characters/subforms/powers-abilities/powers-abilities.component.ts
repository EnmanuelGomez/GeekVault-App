import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-powers-abilities-subform',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './powers-abilities.component.html',
  styleUrls: ['./powers-abilities.component.scss']
})
export class PowersAbilitiesSubformComponent {
  @Input({ required: true }) group!: FormGroup;

  constructor(private fb: FormBuilder) {}

  get powers(): FormArray {
    return this.group.get('powers') as FormArray;
  }

  addPower() {
    this.powers.push(this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    }));
  }

  removePower(index: number) {
    this.powers.removeAt(index);
  }
}
