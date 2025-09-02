import { Component, Input } from '@angular/core';
import { Franchise } from '../../models/franchise.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-franchise-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './franchise-card.component.html',
  styleUrls: ['./franchise-card.component.scss'],
})
export class FranchiseCardComponent {
  @Input({ required: true }) franchise!: Franchise;

  constructor(private router: Router) {}

  fallback(src: Event) {
    const el = src.target as HTMLImageElement;
    el.src = 'assets/placeholders/franchise-fallback.png'; // crea este asset si quieres
  }
}
