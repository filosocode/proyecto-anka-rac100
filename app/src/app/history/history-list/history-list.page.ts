import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonBadge, IonIcon, IonButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircleOutline, timeOutline } from 'ionicons/icons';
import { FormEntry } from '../../shared/models/form.model';
import { FormService } from '../../shared/services/form.service';

@Component({
  selector: 'app-history-list',
  templateUrl: 'history-list.page.html',
  standalone: true,
  imports: [
    RouterModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonBadge, IonIcon, IonButton,
  ],
})
export class HistoryListPage {

  entries: FormEntry[] = [];

  constructor(private formService: FormService) {
    addIcons({ checkmarkCircleOutline, timeOutline });
  }

  ionViewWillEnter(): void {
    this.entries = this.formService.getSubmitted();
  }

  getNombreFormulario(entry: FormEntry): string {
    const tpl = this.formService.getTemplate(entry.templateId);
    return tpl?.title ?? 'Formulario';
  }

  formatFecha(isoString: string): string {
    return new Date(isoString).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'long', year: 'numeric',
    });
  }

  getColorEstado(status: string): string {
    switch (status) {
      case 'synced': return 'success';
      case 'submitted': return 'warning';
      default: return 'medium';
    }
  }

  // Retorna el nombre legible del estado en español
  getNombreEstado(status: string): string {
    switch (status) {
      case 'synced': return 'Sincronizado';
      case 'submitted': return 'Enviado';
      default: return 'Pendiente';
    }
  }
}