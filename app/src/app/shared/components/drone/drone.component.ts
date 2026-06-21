import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-drone',
  standalone: true,
  templateUrl: './drone.component.html',
  styleUrl: './drone.component.scss',
})
export class DroneComponent {
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' = 'md';
  @Input() label: string = '';
  @Input() rings: boolean = false;
}
