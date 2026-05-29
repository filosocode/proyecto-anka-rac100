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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formService: FormService,
    private auth: AuthService,
    private alertCtrl: AlertController,
  ) {}

  ngOnInit(): void {
    // TODO 1: Obtener el id de la plantilla desde la URL.
    //   Usa: const id = this.route.snapshot.paramMap.get('id');
    //   Eso lee el ':id' que está en la ruta '/home/forms/fill/:id'

    // TODO 2: Cargar la plantilla usando el id.
    //   Usa: this.template = this.formService.getTemplate(id);
    //   Si this.template es null, puede ir de regreso: this.router.navigate(['/home/forms']);

    // TODO 3: Inicializar formData con los campos vacíos.
    //   Recorre this.template.fields y para cada campo haz:
    //   this.formData[campo.name] = '';
    //   Así el [(ngModel)] del HTML tiene a dónde enlazarse.
  }

  guardarBorrador(): void {
    // TODO 4: Crear un objeto FormEntry con status 'draft' y guardarlo.
    //   Necesitas: id (usa this.formService.generateId()),
    //              templateId (this.template!.id),
    //              pilotId (this.auth.currentUser()!.id),
    //              data (this.formData),
    //              status: 'draft'
    //   Luego: this.formService.saveEntry(entry);
    //   Y navegar de regreso: this.router.navigate(['/home/forms']);
  }

  async enviar(): Promise<void> {
    // TODO 5: Validar que todos los campos requeridos estén llenos.
    //   Recorre this.template!.fields, y si un campo tiene required=true
    //   y this.formData[campo.name] está vacío, pon un mensaje en this.errorMessage y return.

    // TODO 6 (si pasa la validación): mostrar un diálogo de confirmación.
    //   Usa AlertController para preguntar "¿Enviar el formulario?"
    //   Si el usuario confirma: crea una entrada con status 'submitted' y guárdala.
    //   Luego navega a '/home/history'.
    //
    //   Ejemplo de diálogo:
    //   const alert = await this.alertCtrl.create({
    //     header: 'Confirmar envío',
    //     message: '¿Deseas enviar el formulario?',
    //     buttons: [
    //       { text: 'Cancelar', role: 'cancel' },
    //       { text: 'Enviar', handler: () => { /* guardar y navegar */ } },
    //     ],
    //   });
    //   await alert.present();
  }

  // Retorna los campos que se deben mostrar en el formulario
  getCampos(): FormField[] {
    return this.template?.fields ?? [];
  }
}
