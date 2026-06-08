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

  // Lista de borradores guardados
  drafts: FormEntry[] = [];

  constructor(
    private formService: FormService,
    private router: Router,
    private alertCtrl: AlertController,
  ) {
    addIcons({ trashOutline, createOutline });
  }

  // Se llama cada vez que el usuario entra a esta pantalla
  ionViewWillEnter(): void {
    // TODO 1: Cargar los borradores.
    this.drafts = this.formService.getDrafts();
  }

  // Abre un borrador para continuar editándolo
  continuarBorrador(draft: FormEntry): void {
    // TODO 2: Navegar a la pantalla de llenado con el templateId del borrador.
    // Pasamos el id del borrador por medio de queryParams para poder precargar los datos.
    this.router.navigate(['/home/forms/fill', draft.templateId], {
      queryParams: { draftId: draft.id }
    });
  }

  // Elimina un borrador previa confirmación
  async eliminarBorrador(draft: FormEntry): Promise<void> {
    // TODO 3: Mostrar un diálogo de confirmación antes de borrar.
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

  // Retorna el nombre de la plantilla de un borrador
  getNombreFormulario(draft: FormEntry): string {
    const tpl = this.formService.getTemplate(draft.templateId);
    return tpl?.title ?? 'Formulario desconocido';
  }

  // Formatea la fecha de un borrador para mostrarla
  formatFecha(isoString: string): string {
    return new Date(isoString).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  }
}
