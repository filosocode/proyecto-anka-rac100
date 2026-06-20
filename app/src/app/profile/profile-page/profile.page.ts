import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButton, IonIcon, AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personCircleOutline, logOutOutline, settingsOutline,
  cloudDoneOutline, wifiOutline, cloudOfflineOutline,
} from 'ionicons/icons';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../../shared/services/auth.service';
import { FormService } from '../../shared/services/form.service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  standalone: true, // Asegurado para compatibilidad
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButton, IonIcon,
  ],
})
export class ProfilePage {

  user: User | null = null;
  totalEnviados   = 0;
  totalBorradores = 0;
  estaOnline      = true;

  constructor(
    private auth: AuthService,
    private formService: FormService,
    private router: Router,
    private alertCtrl: AlertController,
  ) {
    addIcons({ personCircleOutline, logOutOutline, settingsOutline,
               cloudDoneOutline, wifiOutline, cloudOfflineOutline });
  }

  ionViewWillEnter(): void {
    this.user           = this.auth.currentUser();
    this.totalEnviados  = this.formService.getSubmitted().length;
    this.totalBorradores = this.formService.getDrafts().length;
    this.estaOnline     = navigator.onLine;
  }

  get iniciales(): string {
    if (!this.user?.name) return '?';
    return this.user.name.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
  }

  async editarPerfil(): Promise<void> {
    if (!this.user) return;
    const alert = await this.alertCtrl.create({
      header: 'Editar Perfil',
      inputs: [
        { name: 'name', value: this.user.name, placeholder: 'Nombre completo', type: 'text' },
        { name: 'password', placeholder: 'Nueva contraseña (dejar vacío para no cambiar)', type: 'password' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            if (!data.name?.trim()) return false;
            const changes: Record<string, string> = { name: data.name.trim() };
            if (data.password?.trim()) changes['password'] = data.password.trim();
            this.auth.updateUser(this.user!.id, changes);
            this.user = this.auth.currentUser();
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  async confirmarCierreSesion(): Promise<void> {
    // TODO 2: Mostrar un diálogo de confirmación antes de cerrar sesión.
    const alert = await this.alertCtrl.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro de que deseas salir?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Salir', 
          role: 'destructive', 
          handler: () => {
            this.auth.logout();
            // auth.logout() usualmente redirige, pero por seguridad, 
            // nos aseguramos de ir al login:
            this.router.navigate(['/login']);
          } 
        },
      ],
    });
    await alert.present();
  }

  irAPanelAdmin(): void {
    // TODO 3: Navegar al panel de administración.
    this.router.navigate(['/admin/drones']);
  }

  esAdmin(): boolean {
    return this.auth.isAdmin();
  }
}