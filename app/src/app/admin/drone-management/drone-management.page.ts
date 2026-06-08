import { Component } from '@angular/core';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonBadge, IonButton,
  IonIcon, IonFab, IonFabButton,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline, createOutline } from 'ionicons/icons';
import { Drone } from '../../shared/models/drone.model';
import { DroneService } from '../../shared/services/drone.service';

@Component({
  selector: 'app-drone-management',
  templateUrl: 'drone-management.page.html',
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonBadge, IonButton,
    IonIcon, IonFab, IonFabButton,
  ],
})
export class DroneManagementPage {

  drones: Drone[] = [];

  constructor(
    private droneService: DroneService,
    private alertCtrl: AlertController,
  ) {
    addIcons({ addOutline, trashOutline, createOutline });
  }

  ionViewWillEnter(): void {
    this.drones = this.droneService.getAll();
  }

  async agregarDrone(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Agregar Drone',
      inputs: [
        { name: 'serial', placeholder: 'Número de serie', type: 'text' },
        { name: 'model', placeholder: 'Modelo', type: 'text' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            if (!data.serial?.trim() || !data.model?.trim()) return false;
            this.droneService.save({
              id: this.droneService.generateId(),
              serial: data.serial.trim(),
              model: data.model.trim(),
              status: 'active',
            });
            this.drones = this.droneService.getAll();
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  async editarDrone(drone: Drone): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Editar Drone',
      inputs: [
        { name: 'serial', value: drone.serial, placeholder: 'Número de serie', type: 'text' },
        { name: 'model', value: drone.model, placeholder: 'Modelo', type: 'text' },
        {
          name: 'status',
          type: 'radio',
          label: 'Activo',
          value: 'active',
          checked: drone.status === 'active',
        },
        {
          name: 'status',
          type: 'radio',
          label: 'Mantenimiento',
          value: 'maintenance',
          checked: drone.status === 'maintenance',
        },
        {
          name: 'status',
          type: 'radio',
          label: 'Inactivo',
          value: 'inactive',
          checked: drone.status === 'inactive',
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            if (!data.serial?.trim() || !data.model?.trim()) return false;
            this.droneService.save({
              ...drone,
              serial: data.serial.trim(),
              model: data.model.trim(),
              status: data.status ?? drone.status,
            });
            this.drones = this.droneService.getAll();
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  async eliminarDrone(drone: Drone): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Drone',
      message: `¿Eliminar el drone ${drone.model} (${drone.serial})?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.droneService.delete(drone.id);
            this.drones = this.droneService.getAll();
          },
        },
      ],
    });
    await alert.present();
  }

  getColorEstado(status: string): string {
    const colores: Record<string, string> = {
      active: 'success',
      maintenance: 'warning',
      inactive: 'medium',
    };
    return colores[status] ?? 'medium';
  }

  getTextoEstado(status: string): string {
    const estados: Record<string, string> = {
      active: 'Activo',
      maintenance: 'Mantenimiento',
      inactive: 'Inactivo',
    };
    return estados[status] ?? status;
  }
}
