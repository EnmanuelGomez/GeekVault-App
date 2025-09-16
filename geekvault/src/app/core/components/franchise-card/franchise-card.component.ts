import { Component, Input } from '@angular/core';
import { Franchise } from '../../models/franchise.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-franchise-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './franchise-card.component.html',
  styleUrls: ['./franchise-card.component.scss'],
})
export class FranchiseCardComponent {
  @Input({ required: true }) franchise!: Franchise;

  fallback(ev: Event) {
    const el = ev.target as HTMLImageElement;
    el.src = 'assets/placeholders/franchise-fallback.png';
  }
}
