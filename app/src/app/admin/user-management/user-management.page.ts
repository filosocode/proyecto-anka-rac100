import { Component } from '@angular/core';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonBadge, IonIcon,
  IonButtons, IonButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline } from 'ionicons/icons';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-user-management',
  templateUrl: 'user-management.page.html',
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonBadge, IonIcon,
    IonButtons, IonButton,
  ],
})
export class UserManagementPage {

  // Lista de usuarios del sistema
  users: User[] = [];

  constructor(private auth: AuthService) {
    addIcons({ personOutline });
  }

  ionViewWillEnter(): void {
    // TODO 1: Cargar la lista de usuarios.
    //   Usa: this.users = this.auth.getUsers();
    //   getUsers() retorna los usuarios guardados en localStorage.
  }

  // Retorna el color del badge según el rol del usuario
  getColorRol(role: string): string {
    // TODO 2: Retornar el color del badge según el rol.
    //   - 'admin' → 'danger'  (rojo)
    //   - 'pilot' → 'primary' (azul)
    return 'medium';
  }

  // Retorna el texto del rol en español
  getTextoRol(role: string): string {
    return role === 'admin' ? 'Admin' : 'Piloto';
  }
}
