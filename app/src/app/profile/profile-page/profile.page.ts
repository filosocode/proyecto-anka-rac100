import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonButton, IonIcon,
  IonAvatar, AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircleOutline, logOutOutline, settingsOutline } from 'ionicons/icons';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonButton, IonIcon, IonAvatar,
  ],
})
export class ProfilePage {

  // Usuario actual (se obtiene del AuthService)
  user: User | null = null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
  ) {
    addIcons({ personCircleOutline, logOutOutline, settingsOutline });
  }

  ionViewWillEnter(): void {
    // TODO 1: Cargar el usuario actual.
    //   Usa: this.user = this.auth.currentUser();
    //   currentUser es un signal, se llama como función: this.auth.currentUser()
  }

  async confirmarCierreSesion(): Promise<void> {
    // TODO 2: Mostrar un diálogo de confirmación antes de cerrar sesión.
    //   Si el usuario confirma, llama a: this.auth.logout()
    //   logout() ya navega al login automáticamente.
    //
    //   Ejemplo de diálogo:
    //   const alert = await this.alertCtrl.create({
    //     header: 'Cerrar sesión',
    //     message: '¿Estás seguro de que deseas salir?',
    //     buttons: [
    //       { text: 'Cancelar', role: 'cancel' },
    //       { text: 'Salir', role: 'destructive', handler: () => this.auth.logout() },
    //     ],
    //   });
    //   await alert.present();
  }

  irAPanelAdmin(): void {
    // TODO 3: Navegar al panel de administración.
    //   Usa: this.router.navigate(['/admin/drones']);
  }

  esAdmin(): boolean {
    return this.auth.isAdmin();
  }
}
