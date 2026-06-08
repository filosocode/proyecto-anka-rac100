import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonBackButton, IonList, IonItem,
  IonLabel, IonInput, IonSelect, IonSelectOption,
  IonButton, IonText, AlertController,
} from '@ionic/angular/standalone';
import { FormEntry, FormField, FormTemplate } from '../../shared/models/form.model';
import { AuthService } from '../../shared/services/auth.service';
import { FormService } from '../../shared/services/form.service';

@Component({
  selector: 'app-form-fill',
  templateUrl: 'form-fill.page.html',
  imports: [
    FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonBackButton, IonList, IonItem,
    IonLabel, IonInput, IonSelect, IonSelectOption,
    IonButton, IonText,
  ],
})
export class FormFillPage implements OnInit {

  template: FormTemplate | null = null;
  formData: Record<string, string> = {};
  errorMessage = '';
  editingEntryId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formService: FormService,
    private auth: AuthService,
    private alertCtrl: AlertController,
  ) {}

  ngOnInit(): void {
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
}
