import { Component } from '@angular/core';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonBadge, IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, timeOutline } from 'ionicons/icons';
import { FormEntry } from '../../shared/models/form.model';
import { FormService } from '../../shared/services/form.service';

@Component({
  selector: 'app-history-list',
  templateUrl: 'history-list.page.html',
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonBadge, IonIcon,
  ],
})
export class HistoryListPage {

  // Lista de formularios enviados (no borradores)
  entries: FormEntry[] = [];

  constructor(private formService: FormService) {
    addIcons({ checkmarkCircleOutline, timeOutline });
  }

  // Se llama cada vez que el usuario entra a esta pantalla
  ionViewWillEnter(): void {
    // TODO 1: Cargar los formularios enviados.
    //   Usa: this.entries = this.formService.getSubmitted();
    //   getSubmitted() retorna los que tienen status 'submitted' o 'synced'.
  }

  // Retorna el nombre de la plantilla para un formulario dado
  getNombreFormulario(entry: FormEntry): string {
    const tpl = this.formService.getTemplate(entry.templateId);
    return tpl?.title ?? 'Formulario';
  }

  // Formatea la fecha para mostrarla al usuario
  formatFecha(isoString: string): string {
    return new Date(isoString).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  }

  // Retorna el color del badge según el estado del formulario
  getColorEstado(status: string): string {
    // TODO 2: Retornar el color correcto según el estado.
    //   - 'synced'    → 'success'   (verde)
    //   - 'submitted' → 'warning'   (amarillo)
    //   - cualquier otro → 'medium' (gris)
    return 'medium';
  }
}
