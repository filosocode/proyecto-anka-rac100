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

  // Plantilla del formulario cargada
  template: FormTemplate | null = null;

  // Objeto que guarda los valores que el usuario va escribiendo
  // La clave es el `name` del campo, el valor es lo que escribe
  formData: Record<string, string> = {};

  // Mensaje de error si faltan campos requeridos
  errorMessage = '';

  // ID del borrador que se está editando (si aplica)
  editingEntryId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formService: FormService,
    private auth: AuthService,
    private alertCtrl: AlertController,
  ) {}

  ngOnInit(): void {
    // TODO 1: Obtener el id de la plantilla desde la URL.
    const templateId = this.route.snapshot.paramMap.get('id');

    // TODO 2: Cargar la plantilla usando el id.
    if (templateId) {
      this.template = this.formService.getTemplate(templateId);
    }

    if (!this.template) {
      this.router.navigate(['/home/forms']);
      return;
    }

    // --- REFINAMIENTO: PRECARGADO DE DATOS ---
    // Si viene un 'draftId' por query params, cargamos el borrador
    const draftId = this.route.snapshot.queryParamMap.get('draftId');
    if (draftId) {
      const existingEntry = this.formService.getEntry(draftId);
      if (existingEntry) {
        this.editingEntryId = draftId;
        this.formData = { ...existingEntry.data };
        return; // Terminamos, ya cargamos los datos reales
      }
    }

    // TODO 3: Inicializar formData con los campos vacíos (solo si no se cargó un borrador)
    this.template.fields.forEach(campo => {
      this.formData[campo.name] = '';
    });
  }

  guardarBorrador(): void {
    // TODO 4: Crear un objeto FormEntry con status 'draft' y guardarlo.
    if (!this.template) return;

    const entry: FormEntry = {
      // Si estamos editando, usamos el ID original, de lo contrario generamos uno nuevo
      id: this.editingEntryId || this.formService.generateId(),
      templateId: this.template.id,
      pilotId: this.auth.currentUser()?.id || 'unknown',
      data: this.formData,
      status: 'draft',
      createdAt: new Date().toISOString(), // Esto será sobrescrito en el service si ya existe
      updatedAt: new Date().toISOString(),
    };

    this.formService.saveEntry(entry);
    this.router.navigate(['/home/forms']);
  }

  async enviar(): Promise<void> {
    // TODO 5: Validar que todos los campos requeridos estén llenos.
    this.errorMessage = '';

    for (const campo of this.template?.fields || []) {
      if (campo.required && !this.formData[campo.name]) {
        this.errorMessage = `El campo "${campo.label}" es obligatorio.`;
        return;
      }
    }

    // TODO 6 (si pasa la validación): mostrar un diálogo de confirmación.
    const alert = await this.alertCtrl.create({
      header: 'Confirmar envío',
      message: '¿Deseas enviar el formulario?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Enviar',
          handler: () => {
            const entry: FormEntry = {
              // Si estamos editando, usamos el ID original, de lo contrario generamos uno nuevo
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

  // Retorna los campos que se deben mostrar en el formulario
  getCampos(): FormField[] {
    return this.template?.fields ?? [];
  }
}
