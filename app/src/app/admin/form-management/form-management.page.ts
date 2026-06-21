import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonIcon, IonButton, IonInput,
  IonFab, IonFabButton, IonToggle,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline, trashOutline, createOutline, documentTextOutline,
  listOutline, checkmarkOutline, closeOutline,
} from 'ionicons/icons';
import { FormTemplate } from '../../shared/models/form.model';
import { FormService } from '../../shared/services/form.service';

@Component({
  selector: 'app-form-management',
  templateUrl: 'form-management.page.html',
  styleUrl: './form-management.page.scss',
  standalone: true,
  imports: [
    FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonIcon, IonButton, IonInput,
    IonFab, IonFabButton, IonToggle,
  ],
})
export class FormManagementPage {

  templates: FormTemplate[] = [];
  editandoId: string | null = null;
  editandoTitulo = '';

  constructor(
    private formService: FormService,
    private alertCtrl: AlertController,
    private router: Router,
  ) {
    addIcons({ addOutline, trashOutline, createOutline, documentTextOutline, listOutline, checkmarkOutline, closeOutline });
  }

  ionViewWillEnter(): void {
    this.templates = this.formService.getTemplates();
    this.editandoId = null;
  }

  gestionarCampos(id: string): void {
    this.router.navigate(['/admin/forms', id, 'fields']);
  }

  iniciarEdicion(template: FormTemplate): void {
    this.editandoId = template.id;
    this.editandoTitulo = template.title;
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.editandoTitulo = '';
  }

  guardarEdicion(template: FormTemplate): void {
    const titulo = this.editandoTitulo.trim();
    if (!titulo) return;
    this.formService.saveTemplate({ ...template, title: titulo });
    this.templates = this.formService.getTemplates();
    this.editandoId = null;
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
