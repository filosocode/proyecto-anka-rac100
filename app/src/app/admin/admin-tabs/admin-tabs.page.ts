import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel,
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { airplaneOutline, peopleOutline, logOutOutline } from 'ionicons/icons';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-admin-tabs',
  templateUrl: 'admin-tabs.page.html',
  standalone: true,
  imports: [
    IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  ],
})
export class AdminTabsPage {
  constructor(
    private auth: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
  ) {
    addIcons({ airplaneOutline, peopleOutline, logOutOutline });
  }

  async cerrarSesion(): Promise<void> {
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
            this.router.navigate(['/login']);
          },
        },
      ],
    });
    await alert.present();
  }
}
