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

  // Buffer temporal entre pasos del alert
  private _bufferDatos: { name: string; email: string; password: string } | null = null;

  constructor(
    private auth: AuthService,
    private alertCtrl: AlertController,
  ) {
    addIcons({ personOutline, addOutline, trashOutline, createOutline });
  }

  ionViewWillEnter(): void {
    this.users = this.auth.getUsers();
  }

  // CREAR — paso 1: datos básicos
  async agregarUsuario(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Nuevo Usuario (1/2)',
      subHeader: 'Datos de acceso',
      inputs: [
        { name: 'name',     placeholder: 'Nombre completo',   type: 'text' },
        { name: 'email',    placeholder: 'Correo electrónico', type: 'email' },
        { name: 'password', placeholder: 'Contraseña',         type: 'password' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Siguiente →',
          handler: (data) => {
            if (!data.name?.trim() || !data.email?.trim() || !data.password?.trim()) return false;
            this._bufferDatos = { name: data.name.trim(), email: data.email.trim(), password: data.password };
            this.elegirRol(null);
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  // EDITAR — paso 1: datos básicos
  async editarUsuario(user: User): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Editar Usuario (1/2)',
      subHeader: 'Datos de acceso',
      inputs: [
        { name: 'name',     value: user.name,  placeholder: 'Nombre completo',   type: 'text' },
        { name: 'email',    value: user.email, placeholder: 'Correo electrónico', type: 'email' },
        { name: 'password', placeholder: 'Nueva contraseña (vacío = sin cambio)', type: 'password' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Siguiente →',
          handler: (data) => {
            if (!data.name?.trim() || !data.email?.trim()) return false;
            this._bufferDatos = { name: data.name.trim(), email: data.email.trim(), password: data.password ?? '' };
            this.elegirRol(user);
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  // Paso 2 compartido: elegir rol con radio-only alert
  private async elegirRol(userExistente: User | null): Promise<void> {
    const rolActual = userExistente?.role ?? 'pilot';
    const alert = await this.alertCtrl.create({
      header: userExistente ? 'Editar Usuario (2/2)' : 'Nuevo Usuario (2/2)',
      subHeader: 'Selecciona el rol',
      inputs: [
        { type: 'radio', label: 'Piloto',          value: 'pilot', checked: rolActual === 'pilot' },
        { type: 'radio', label: 'Administrador',   value: 'admin', checked: rolActual === 'admin' },
      ],
      buttons: [
        { text: 'Atrás', role: 'cancel' },
        {
          text: userExistente ? 'Actualizar' : 'Crear',
          handler: (role) => {
            const datos = this._bufferDatos!;
            if (userExistente) {
              const changes: Record<string, string> = { name: datos.name, email: datos.email, role: role ?? rolActual };
              if (datos.password) changes['password'] = datos.password;
              this.auth.updateUser(userExistente.id, changes);
            } else {
              this.auth.addUser({
                id: this.auth.generateUserId(),
                name: datos.name,
                email: datos.email,
                password: datos.password,
                role: role ?? 'pilot',
              });
            }
            this._bufferDatos = null;
            this.users = this.auth.getUsers();
          },
        },
      ],
    });
    await alert.present();
  }

  async eliminarUsuario(user: User): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Usuario',
      message: `¿Eliminar a ${user.name}?`,
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
