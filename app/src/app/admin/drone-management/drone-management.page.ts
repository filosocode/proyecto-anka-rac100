import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // Agregado para que routerLink funcione en el HTML
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
  standalone: true, // Asegurado para compatibilidad
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonBadge, IonButton,
    IonButtons, IonIcon, IonFab, IonFabButton,
    RouterLink, // Necesario para navegar a Usuarios
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
    this.drones = this.droneService.getAll();
  }

  async agregarDrone(): Promise<void> {
    // TODO 2: Mostrar un formulario (ion-alert con inputs) para agregar un drone.
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
            // Validación básica para no guardar drones vacíos
            if (!data.serial || !data.model) return false;

            const nuevo: Drone = {
              id: this.droneService.generateId(),
              serial: data.serial,
              model: data.model,
              status: 'active',
            };
            this.droneService.save(nuevo);
            this.drones = this.droneService.getAll();
            return true;
          }
        },
      ],
    });
    await alert.present();
  }

  async eliminarDrone(drone: Drone): Promise<void> {
    // TODO 3: Confirmar y eliminar un drone.
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Drone',
      message: `¿Estás seguro de que deseas eliminar el drone modelo ${drone.model}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.droneService.delete(drone.id);
            this.drones = this.droneService.getAll();
          }
        }
      ]
    });
    await alert.present();
  }

  // Retorna el color del badge según el estado del drone
  getColorEstado(status: string): string {
    // TODO 4: Retornar el color según el estado.
    const colores: Record<string, string> = {
      active: 'success',
      maintenance: 'warning',
      inactive: 'medium',
    };
    return colores[status] ?? 'medium';
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