import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AddFranchiseComponent } from './add-franchise/add-franchise.component';
import { AddCharacterComponent } from './add-character/add-character.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { AddCharacterCategoryComponent } from './add-character-category/add-character-category.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'add_franchise', component: AddFranchiseComponent },
  { path: 'add_category' , component: AddCategoryComponent },
  { path: 'add_character', component: AddCharacterComponent },
  { path: 'add_character_category', component: AddCharacterCategoryComponent }
];
