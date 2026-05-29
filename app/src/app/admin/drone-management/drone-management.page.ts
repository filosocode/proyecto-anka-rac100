import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonBadge
} from '@ionic/angular/standalone';
import { Drone } from '../../shared/models/drone.model';
import { StorageService } from '../../shared/services/storage.service';

@Component({
  selector: 'app-drone-management',
  templateUrl: './drone-management.page.html',
  styleUrls: ['./drone-management.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonBadge],
})
export class DroneManagementPage implements OnInit {
  drones: Drone[] = [];

  constructor(private storage: StorageService) {}

  ngOnInit() {
    // RF13: gestión de drones — conectar con API
    this.drones = this.storage.get<Drone[]>('drones') ?? [];
  }
}
