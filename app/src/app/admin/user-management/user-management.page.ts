import { Component } from '@angular/core';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, 
  IonLabel, IonBadge, IonIcon, IonButtons, IonButton, IonBackButton 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline } from 'ionicons/icons';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-user-management',
  templateUrl: 'user-management.page.html',
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonBadge, IonIcon,
    IonButtons, IonButton, IonBackButton
  ],
})
export class UserManagementPage {
  // 1. Esta variable evita el error en "@for (user of users...)"
  users: User[] = [];

  constructor(private auth: AuthService) {
    addIcons({ personOutline });
  }

  ionViewWillEnter(): void {
    // 2. Aquí cargas los datos cuando entras a la página
    this.users = this.auth.getUsers();
  }

  // 3. Estas funciones evitan el error en "[color]" y "{{ getTextoRol() }}"
  getColorRol(role: string): string {
    return role === 'admin' ? 'danger' : 'primary';
  }

  getTextoRol(role: string): string {
    return role === 'admin' ? 'Admin' : 'Piloto';
  }
}
