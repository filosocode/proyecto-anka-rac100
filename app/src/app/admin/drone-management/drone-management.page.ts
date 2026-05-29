import { Component } from '@angular/core';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonBadge, IonButton,
  IonButtons, IonIcon, IonFab, IonFabButton,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline, createOutline } from 'ionicons/icons';
import { Drone } from '../../shared/models/drone.model';
import { DroneService } from '../../shared/services/drone.service';

@Component({
  selector: 'app-drone-management',
  templateUrl: 'drone-management.page.html',
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonBadge, IonButton,
    IonButtons, IonIcon, IonFab, IonFabButton,
  ],
})
export class DroneManagementPage {

  // Lista de drones
  drones: Drone[] = [];

  constructor(
    private droneService: DroneService,
    private alertCtrl: AlertController,
  ) {
    addIcons({ addOutline, trashOutline, createOutline });
  }

  ionViewWillEnter(): void {
    // TODO 1: Cargar la lista de drones.
    //   Usa: this.drones = this.droneService.getAll();
  }

  async agregarDrone(): Promise<void> {
    // TODO 2: Mostrar un formulario (ion-alert con inputs) para agregar un drone.
    //   Campos necesarios: serial (texto), model (texto)
    //   Si el usuario confirma, crear un objeto Drone y guardarlo con droneService.save()
    //   Luego actualizar la lista: this.drones = this.droneService.getAll();
    //
    //   Ejemplo de alert con inputs:
    //   const alert = await this.alertCtrl.create({
    //     header: 'Agregar Drone',
    //     inputs: [
    //       { name: 'serial', placeholder: 'Número de serie', type: 'text' },
    //       { name: 'model', placeholder: 'Modelo', type: 'text' },
    //     ],
    //     buttons: [
    //       { text: 'Cancelar', role: 'cancel' },
    //       { text: 'Guardar', handler: (data) => {
    //           const nuevo: Drone = {
    //             id: this.droneService.generateId(),
    //             serial: data.serial,
    //             model: data.model,
    //             status: 'active',
    //           };
    //           this.droneService.save(nuevo);
    //           this.drones = this.droneService.getAll();
    //         }
    //       },
    //     ],
    //   });
    //   await alert.present();
  }

  async eliminarDrone(drone: Drone): Promise<void> {
    // TODO 3: Confirmar y eliminar un drone.
    //   Similar al TODO 2 pero más simple: solo un confirm dialog.
    //   Si confirma: this.droneService.delete(drone.id);
    //   Luego: this.drones = this.droneService.getAll();
  }

  // Retorna el color del badge según el estado del drone
  getColorEstado(status: string): string {
    // TODO 4: Retornar el color según el estado.
    //   - 'active'      → 'success'
    //   - 'maintenance' → 'warning'
    //   - 'inactive'    → 'medium'
    return 'medium';
  }

  // Traduce el estado del drone al español
  getTextoEstado(status: string): string {
    const estados: Record<string, string> = {
      active: 'Activo',
      maintenance: 'Mantenimiento',
      inactive: 'Inactivo',
    };
    return estados[status] ?? status;
  }
}
