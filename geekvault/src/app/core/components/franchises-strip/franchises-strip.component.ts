import { Component, Input, OnInit, inject } from '@angular/core';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { Observable } from 'rxjs';
import { FranchiseService } from '../../services/franchise.service';
import { Franchise } from '../../models/franchise.model';
import { FranchiseCardComponent } from "../franchise-card/franchise-card.component";

@Component({
  selector: 'app-franchises-strip',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, FranchiseCardComponent],
  templateUrl: './franchises-strip.component.html',
  styleUrls: ['./franchises-strip.component.scss'],
})
export class FranchisesStripComponent implements OnInit {
  private franchiseSrv = inject(FranchiseService);

  // ✅ tolera ambos tipos (temporalmente)
  @Input({ required: true }) categoryId!: string | number;

  franchises$!: Observable<Franchise[]>;

  ngOnInit(): void {
    this.franchises$ = this.franchiseSrv.getByCategory(this.categoryId);
  }

  trackById = (_: number, it: Franchise) => it.id;
}
