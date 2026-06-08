import { Component } from '@angular/core';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonBadge, IonIcon, IonButton,
  IonFab, IonFabButton, IonToggle,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline, createOutline, documentTextOutline } from 'ionicons/icons';
import { FormTemplate } from '../../shared/models/form.model';
import { FormService } from '../../shared/services/form.service';

@Component({
  selector: 'app-form-management',
  templateUrl: 'form-management.page.html',
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonBadge, IonIcon, IonButton,
    IonFab, IonFabButton, IonToggle,
  ],
})
export class FormManagementPage {

  templates: FormTemplate[] = [];

  constructor(
    private formService: FormService,
    private alertCtrl: AlertController,
  ) {
    addIcons({ addOutline, trashOutline, createOutline, documentTextOutline });
  }

  ionViewWillEnter(): void {
    this.templates = this.formService.getTemplates();
  }

  async crearFormulario(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Nuevo Formulario',
      inputs: [
        { name: 'title', placeholder: 'Título del formulario', type: 'text' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Crear',
          handler: (data) => {
            if (!data.title?.trim()) return false;
            const template: FormTemplate = {
              id: this.formService.generateTemplateId(),
              title: data.title.trim(),
              fields: [],
              active: true,
            };
            this.formService.saveTemplate(template);
            this.templates = this.formService.getTemplates();
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  async editarFormulario(template: FormTemplate): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Editar Formulario',
      inputs: [
        { name: 'title', value: template.title, placeholder: 'Título del formulario', type: 'text' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            if (!data.title?.trim()) return false;
            this.formService.saveTemplate({ ...template, title: data.title.trim() });
            this.templates = this.formService.getTemplates();
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  toggleActivo(template: FormTemplate): void {
    this.formService.toggleActive(template.id);
    this.templates = this.formService.getTemplates();
  }

  async eliminarFormulario(template: FormTemplate): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Formulario',
      message: `¿Eliminar "${template.title}"? Los registros existentes no se verán afectados.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.formService.deleteTemplate(template.id);
            this.templates = this.formService.getTemplates();
          },
        },
      ],
    });
    await alert.present();
  }
}
