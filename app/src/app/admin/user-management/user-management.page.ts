import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonBadge
} from '@ionic/angular/standalone';
import { User } from '../../shared/models/user.model';
import { StorageService } from '../../shared/services/storage.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.page.html',
  styleUrls: ['./user-management.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonBadge],
})
export class UserManagementPage implements OnInit {
  users: User[] = [];

  constructor(private storage: StorageService) {}

  ngOnInit() {
    // RF11: gestión de usuarios — conectar con API
    this.users = this.storage.get<User[]>('users') ?? [];
  }
}
