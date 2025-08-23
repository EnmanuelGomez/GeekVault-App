import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AddFranchiseComponent } from './add-franchise/add-franchise.component';
import { AddCharacterComponent } from './add-character/add-character.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'add_franchise', component: AddFranchiseComponent },
  { path: 'add_character', component: AddCharacterComponent}
];
