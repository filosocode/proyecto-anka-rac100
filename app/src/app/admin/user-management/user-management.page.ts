import { Component } from '@angular/core';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonBadge, IonIcon, IonButton,
  IonFab, IonFabButton,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, addOutline, trashOutline, createOutline } from 'ionicons/icons';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-user-management',
  templateUrl: 'user-management.page.html',
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonBadge, IonIcon, IonButton,
    IonFab, IonFabButton,
  ],
})
export class UserManagementPage {

  users: User[] = [];

  constructor(
    private auth: AuthService,
    private alertCtrl: AlertController,
  ) {
    addIcons({ personOutline, addOutline, trashOutline, createOutline });
  }

  ionViewWillEnter(): void {
    this.users = this.auth.getUsers();
  }

  async agregarUsuario(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Agregar Usuario',
      inputs: [
        { name: 'name', placeholder: 'Nombre completo', type: 'text' },
        { name: 'email', placeholder: 'Correo electrónico', type: 'email' },
        { name: 'password', placeholder: 'Contraseña', type: 'password' },
        {
          name: 'role', type: 'radio', label: 'Piloto', value: 'pilot', checked: true,
        },
        {
          name: 'role', type: 'radio', label: 'Administrador', value: 'admin',
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            if (!data.name?.trim() || !data.email?.trim() || !data.password?.trim()) return false;
            this.auth.addUser({
              id: this.auth.generateUserId(),
              name: data.name.trim(),
              email: data.email.trim(),
              password: data.password,
              role: data.role ?? 'pilot',
            });
            this.users = this.auth.getUsers();
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  async editarUsuario(user: User): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Editar Usuario',
      inputs: [
        { name: 'name', value: user.name, placeholder: 'Nombre completo', type: 'text' },
        { name: 'email', value: user.email, placeholder: 'Correo electrónico', type: 'email' },
        { name: 'password', placeholder: 'Nueva contraseña (dejar vacío para no cambiar)', type: 'password' },
        {
          name: 'role', type: 'radio', label: 'Piloto', value: 'pilot', checked: user.role === 'pilot',
        },
        {
          name: 'role', type: 'radio', label: 'Administrador', value: 'admin', checked: user.role === 'admin',
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            if (!data.name?.trim() || !data.email?.trim()) return false;
            const changes: Partial<User & { password: string }> = {
              name: data.name.trim(),
              email: data.email.trim(),
              role: data.role ?? user.role,
            };
            if (data.password?.trim()) changes['password'] = data.password.trim();
            this.auth.updateUser(user.id, changes);
            this.users = this.auth.getUsers();
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  async eliminarUsuario(user: User): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Usuario',
      message: `¿Eliminar el usuario ${user.name}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.auth.deleteUser(user.id);
            this.users = this.auth.getUsers();
          },
        },
      ],
    });
    await alert.present();
  }

  getColorRol(role: string): string {
    return role === 'admin' ? 'danger' : 'primary';
  }

  getTextoRol(role: string): string {
    return role === 'admin' ? 'Admin' : 'Piloto';
  }
}
