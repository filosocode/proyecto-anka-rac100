import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet, ToastController } from '@ionic/angular/standalone';
import { SyncService } from './shared/services/sync.service';
import { ThemeService } from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(
    private syncService: SyncService,
    private toastCtrl: ToastController,
    private themeService: ThemeService,   // inicializa el tema guardado
  ) {}

  ngOnInit(): void {
    window.addEventListener('online', () => this.onConexionRecuperada());
  }

  async onConexionRecuperada(): Promise<void> {
    const pendientes = this.syncService.getPendingCount();
    if (pendientes === 0) return;

    const toast = await this.toastCtrl.create({
      message: `Conexión restaurada. ${pendientes} formulario(s) pendientes.`,
      position: 'top',
      color: 'success',
      buttons: [{
        text: 'Sincronizar',
        handler: () => this.syncService.syncPending()
      }],
      duration: 8000
    });
    await toast.present();
  }
}
