import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-franchise',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-franchise.component.html',
  styleUrls: ['./add-franchise.component.scss']
})
export class AddFranchiseComponent {
  selectedImage: string | null = null;

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}
