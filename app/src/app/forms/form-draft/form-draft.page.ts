import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonBackButton, IonList, IonItem,
  IonLabel, IonIcon, IonButton, IonItemSliding,
  IonItemOptions, IonItemOption, AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline, createOutline } from 'ionicons/icons';
import { FormEntry } from '../../shared/models/form.model';
import { FormService } from '../../shared/services/form.service';

@Component({
  selector: 'app-form-draft',
  templateUrl: 'form-draft.page.html',
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonBackButton, IonList, IonItem,
    IonLabel, IonIcon, IonButton,
    IonItemSliding, IonItemOptions, IonItemOption,
  ],
})
export class FormDraftPage {

  drafts: FormEntry[] = [];

  constructor(
    private formService: FormService,
    private router: Router,
    private alertCtrl: AlertController,
  ) {
    addIcons({ trashOutline, createOutline });
  }

  ionViewWillEnter(): void {
    this.drafts = this.formService.getDrafts();
  }

  continuarBorrador(draft: FormEntry): void {
    this.router.navigate(['/home/forms/fill', draft.templateId], {
      queryParams: { draftId: draft.id }
    });
  }

  async eliminarBorrador(draft: FormEntry): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar borrador',
      message: '¿Seguro que deseas eliminar este borrador?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.formService.deleteEntry(draft.id);
            this.drafts = this.formService.getDrafts();
          }
        },
      ],
    });
    await alert.present();
  }

  getNombreFormulario(draft: FormEntry): string {
    const tpl = this.formService.getTemplate(draft.templateId);
    return tpl?.title ?? 'Formulario desconocido';
  }

  formatFecha(isoString: string): string {
    return new Date(isoString).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  }
}
