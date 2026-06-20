import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonBackButton, IonList, IonItem,
  IonLabel, IonInput, IonSelect, IonSelectOption,
  IonButton, IonIcon, IonText, AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { locationOutline, cameraOutline } from 'ionicons/icons';
import { FormEntry, FormField, FormTemplate } from '../../shared/models/form.model';
import { Drone } from '../../shared/models/drone.model';
import { AuthService } from '../../shared/services/auth.service';
import { FormService } from '../../shared/services/form.service';
import { DroneService } from '../../shared/services/drone.service';

@Component({
  selector: 'app-form-fill',
  templateUrl: 'form-fill.page.html',
  imports: [
    FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonBackButton, IonList, IonItem,
    IonLabel, IonInput, IonSelect, IonSelectOption,
    IonButton, IonIcon, IonText,
  ],
})
export class FormFillPage implements OnInit {

  template: FormTemplate | null = null;
  formData: Record<string, string> = {};
  errorMessage = '';
  editingEntryId: string | null = null;
  drones: Drone[] = [];
  selectedDroneId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formService: FormService,
    private auth: AuthService,
    private alertCtrl: AlertController,
    private droneService: DroneService,
  ) {
    addIcons({ locationOutline, cameraOutline });
  }

  ngOnInit(): void {
    this.drones = this.droneService.getAll();

    const templateId = this.route.snapshot.paramMap.get('id');
    if (templateId) {
      this.template = this.formService.getTemplate(templateId);
    }

    if (!this.template) {
      this.router.navigate(['/home/forms']);
      return;
    }

    const draftId = this.route.snapshot.queryParamMap.get('draftId');
    if (draftId) {
      const existingEntry = this.formService.getEntry(draftId);
      if (existingEntry) {
        this.editingEntryId = draftId;
        this.formData = { ...existingEntry.data };
        this.selectedDroneId = existingEntry.droneId ?? '';
        return;
      }
    }

    this.template.fields.forEach(campo => {
      this.formData[campo.name] = '';
    });
  }

  guardarBorrador(): void {
    if (!this.template) return;

    const entry: FormEntry = {
      id: this.editingEntryId || this.formService.generateId(),
      templateId: this.template.id,
      pilotId: this.auth.currentUser()?.id || 'unknown',
      droneId: this.selectedDroneId,
      data: this.formData,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.formService.saveEntry(entry);
    this.router.navigate(['/home/forms']);
  }

  async enviar(): Promise<void> {
    this.errorMessage = '';

    if (!this.selectedDroneId) {
      this.errorMessage = 'Debes seleccionar un drone.';
      return;
    }

    for (const campo of this.template?.fields || []) {
      if (campo.required && !this.formData[campo.name]) {
        this.errorMessage = `El campo "${campo.label}" es obligatorio.`;
        return;
      }
    }

    const alert = await this.alertCtrl.create({
      header: 'Confirmar envío',
      message: '¿Deseas enviar el formulario?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Enviar',
          handler: () => {
            const entry: FormEntry = {
              id: this.editingEntryId || this.formService.generateId(),
              templateId: this.template!.id,
              pilotId: this.auth.currentUser()?.id || 'unknown',
              droneId: this.selectedDroneId,
              data: this.formData,
              status: 'submitted',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            this.formService.saveEntry(entry);
            this.router.navigate(['/home/history']);
          }
        },
      ],
    });
    await alert.present();
  }

  getCampos(): FormField[] {
    return this.template?.fields ?? [];
  }

  obtenerUbicacion(fieldName: string): void {
    if (!navigator.geolocation) {
      this.formData[fieldName] = 'GPS no disponible';
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.formData[fieldName] =
          `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
      },
      () => {
        this.formData[fieldName] = 'Error al obtener ubicación';
      },
    );
  }

  onFileChange(event: Event, fieldName: string): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const reader = new FileReader();
    reader.onload = () => {
      // Guarda el base64 completo — se persiste en localStorage
      this.formData[fieldName] = reader.result as string;
    };
    reader.readAsDataURL(input.files[0]);
  }
}
