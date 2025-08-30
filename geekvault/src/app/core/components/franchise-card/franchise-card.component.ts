import { Component, Input } from '@angular/core';
import { Franchise } from '../../models/franchise.model';

@Component({
  selector: 'app-franchise-card',
  standalone: true,
  templateUrl: './franchise-card.component.html',
  styleUrls: ['./franchise-card.component.scss'],
})
export class FranchiseCardComponent {
  @Input({ required: true }) franchise!: Franchise;

  fallback(src: Event) {
    const el = src.target as HTMLImageElement;
    el.src = 'assets/placeholders/franchise-fallback.png'; // crea este asset si quieres
  }
}
