import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentTextOutline, addOutline, archiveOutline } from 'ionicons/icons';
import { FormTemplate } from '../../shared/models/form.model';
import { FormService } from '../../shared/services/form.service';

@Component({
  selector: 'app-form-list',
  templateUrl: 'form-list.page.html',
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonIcon, IonBadge,
    IonButton, IonButtons, IonCard, IonCardHeader,
    IonCardTitle, IonCardContent,
  ],
})
export class FormListPage implements OnInit {

  // Lista de plantillas de formularios disponibles
  templates: FormTemplate[] = [];

  // Cantidad de borradores guardados (para mostrar badge)
  draftCount = 0;

  constructor(
    private formService: FormService,
    private router: Router,
  ) {
    addIcons({ documentTextOutline, addOutline, archiveOutline });
  }

  ngOnInit(): void {
    // TODO 1: Cargar las plantillas disponibles.
    this.templates = this.formService.getTemplates();

    // TODO 2: Contar los borradores guardados.
    this.draftCount = this.formService.getDrafts().length;
  }

  // Se llama cada vez que el usuario regresa a esta pantalla
  ionViewWillEnter(): void {
    // TODO 3: Volver a cargar los datos (por si guardaron un nuevo borrador).
    this.templates = this.formService.getTemplates();
    this.draftCount = this.formService.getDrafts().length;
  }

  // Navega a la pantalla de llenado del formulario con el id de la plantilla
  abrirFormulario(templateId: string): void {
    // TODO 4: Navegar a la ruta de llenado de formulario.
    this.router.navigate(['/home/forms/fill', templateId]);
  }

  // Navega a la pantalla de borradores
  verBorradores(): void {
    // TODO 5: Navegar a la pantalla de borradores.
    this.router.navigate(['/home/forms/draft']);
  }
}
