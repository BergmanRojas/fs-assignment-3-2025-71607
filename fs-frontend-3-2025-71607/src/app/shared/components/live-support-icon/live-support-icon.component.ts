import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LiveSupportComponent } from '../live-support/live-support.component';

@Component({
  selector: 'app-live-support-icon',
  standalone: true,
  imports: [CommonModule,LiveSupportComponent],
  templateUrl: './live-support-icon.component.html',
  styleUrl: './live-support-icon.component.scss'
})
export class LiveSupportIconComponent {
  isOpen = false;

  toggleChat() {
    this.isOpen = !this.isOpen;
  }
}
