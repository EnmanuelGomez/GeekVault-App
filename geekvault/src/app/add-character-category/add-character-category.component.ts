import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-character-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-character-category.component.html'
})
export class AddCharacterCategoryComponent {
  characterCategoryForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.characterCategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['']
    });
  }

  onSubmit() {
    console.log(this.characterCategoryForm.value);
  }
}
