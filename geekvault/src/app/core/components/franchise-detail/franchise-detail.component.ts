import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-franchise-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['./franchise-detail.component.scss'],
  templateUrl: './franchise-detail.component.html'
})
export class FranchiseDetailComponent {
  private route = inject(ActivatedRoute);

  // El resolver garantiza que 'vm' existe cuando se activa la ruta
  vm$ = this.route.data.pipe(
    map(data => data['vm'] as { franchise: any; characters: any[] })
  );

  trackByCharId = (_: number, c: { id: string }) => c.id;

  onImgError(ev: Event) {
    const el = ev.target as HTMLImageElement | null;
    if (el) el.src = 'assets/placeholders/character-portrait.png';
  }
}
