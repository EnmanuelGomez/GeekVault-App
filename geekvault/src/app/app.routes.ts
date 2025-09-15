import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AddFranchiseComponent } from './add-franchise/add-franchise.component';
import { AddCharacterComponent } from './add-character/add-character.component';
import { AddCategoryComponent } from './add-category/add-category.component';
import { AddCharacterCategoryComponent } from './add-character-category/add-character-category.component';
import { AddTeamsComponent } from './add-teams/add-teams.component';
import { FranchiseDetailComponent } from './core/components/franchise-detail/franchise-detail.component';
import { franchiseDetailResolver } from './core/resolvers/franchise-detail.resolver';
import { CharacterDetailComponent } from './features/characters/character-detail/character-detail.component';
import { characterResolver } from './core/resolvers/character-detail.resolver';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'add_franchise', component: AddFranchiseComponent },
  { path: 'add_category' , component: AddCategoryComponent },
  { path: 'add_character', component: AddCharacterComponent },
  { path: 'add_character_category', component: AddCharacterCategoryComponent },
  { path: 'add_teams', component: AddTeamsComponent },
  // Detalle vacío por ahora
  {
  path: 'franchise/:id',
  component: FranchiseDetailComponent,
  resolve: { vm: franchiseDetailResolver },
  runGuardsAndResolvers: 'always'
  },
  {
    path: 'characters/:id',
    loadComponent: () =>
      import('./features/characters/character-detail/character-detail.component')
        .then(m => m.CharacterDetailComponent),
    resolve: { character: characterResolver },
  },
  {
    path: 'franchise/:id/edit',
    component: AddFranchiseComponent,
    resolve: { vm: franchiseDetailResolver },
    runGuardsAndResolvers: 'always'
  },
];
