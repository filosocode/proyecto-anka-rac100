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

  private _bufferDrone: Partial<Drone> | null = null;

  constructor(
    private droneService: DroneService,
    private alertCtrl: AlertController,
  ) {
    addIcons({ addOutline, trashOutline, createOutline });
  }

  ionViewWillEnter(): void {
    this.drones = this.droneService.getAll();
  }

  // CREAR — paso 1: serie y modelo
  async agregarDrone(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Nuevo Drone (1/3)',
      subHeader: 'Datos básicos',
      inputs: [
        { name: 'serial', placeholder: 'Número de serie', type: 'text' },
        { name: 'model',  placeholder: 'Modelo',          type: 'text' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Siguiente →',
          handler: (data) => {
            if (!data.serial?.trim() || !data.model?.trim()) return false;
            this._bufferDrone = { id: this.droneService.generateId(), serial: data.serial.trim(), model: data.model.trim() };
            this.elegirTipo();
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  // EDITAR — paso 1: serie y modelo
  async editarDrone(drone: Drone): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Editar Drone (1/3)',
      subHeader: 'Datos básicos',
      inputs: [
        { name: 'serial', value: drone.serial, placeholder: 'Número de serie', type: 'text' },
        { name: 'model',  value: drone.model,  placeholder: 'Modelo',          type: 'text' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Siguiente →',
          handler: (data) => {
            if (!data.serial?.trim() || !data.model?.trim()) return false;
            this._bufferDrone = { ...drone, serial: data.serial.trim(), model: data.model.trim() };
            this.elegirTipo();
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  // Paso 2: tipo de aeronave (radio-only)
  private async elegirTipo(): Promise<void> {
    const tipoActual = this._bufferDrone?.['tipo'] ?? 'Quadcóptero';
    const alert = await this.alertCtrl.create({
      header: 'Tipo de aeronave (2/3)',
      inputs: [
        { type: 'radio', label: 'Quadcóptero',  value: 'Quadcóptero',  checked: tipoActual === 'Quadcóptero' },
        { type: 'radio', label: 'Hexacóptero',  value: 'Hexacóptero',  checked: tipoActual === 'Hexacóptero' },
        { type: 'radio', label: 'Octacóptero',  value: 'Octacóptero',  checked: tipoActual === 'Octacóptero' },
        { type: 'radio', label: 'Ala fija',     value: 'Ala fija',     checked: tipoActual === 'Ala fija' },
        { type: 'radio', label: 'VTOL',         value: 'VTOL',         checked: tipoActual === 'VTOL' },
      ],
      buttons: [
        { text: 'Atrás', role: 'cancel' },
        {
          text: 'Siguiente →',
          handler: (tipo) => {
            this._bufferDrone = { ...this._bufferDrone, tipo: tipo ?? 'Quadcóptero' };
            this.elegirEstado();
          },
        },
      ],
    });
    await alert.present();
  }

  // Paso 3: estado operativo (radio-only)
  private async elegirEstado(): Promise<void> {
    const statusActual = (this._bufferDrone as Drone)?.status ?? 'active';
    const alert = await this.alertCtrl.create({
      header: 'Estado operativo (3/3)',
      inputs: [
        { type: 'radio', label: 'Activo',        value: 'active',      checked: statusActual === 'active' },
        { type: 'radio', label: 'Mantenimiento', value: 'maintenance', checked: statusActual === 'maintenance' },
        { type: 'radio', label: 'Inactivo',      value: 'inactive',    checked: statusActual === 'inactive' },
      ],
      buttons: [
        { text: 'Atrás', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (status) => {
            const drone = { ...this._bufferDrone, status: status ?? 'active' } as Drone;
            this.droneService.save(drone);
            this.drones = this.droneService.getAll();
            this._bufferDrone = null;
          },
        },
      ],
    });
    await alert.present();
  }

  async eliminarDrone(drone: Drone): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Drone',
      message: `¿Eliminar ${drone.model} (${drone.serial})?`,
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
    const colores: Record<string, string> = { active: 'success', maintenance: 'warning', inactive: 'medium' };
    return colores[status] ?? 'medium';
  }

  getTextoEstado(status: string): string {
    const estados: Record<string, string> = { active: 'Activo', maintenance: 'Mantenimiento', inactive: 'Inactivo' };
    return estados[status] ?? status;
  }
}
