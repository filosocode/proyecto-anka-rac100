import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonBadge, IonIcon, IonButton,
  IonButtons, IonFab, IonFabButton,
  AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline, listOutline, arrowBackOutline } from 'ionicons/icons';
import { FormField, FormTemplate } from '../../shared/models/form.model';
import { FormService } from '../../shared/services/form.service';

@Component({
  selector: 'app-form-fields',
  templateUrl: 'form-fields.page.html',
  standalone: true,
  imports: [
      IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonBadge, IonIcon, IonButton,
    IonButtons, IonFab, IonFabButton,
  ],
})
export class FormFieldsPage {

  template: FormTemplate | null = null;
  private _bufferCampo: Partial<FormField> | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formService: FormService,
    private alertCtrl: AlertController,
  ) {
    addIcons({ addOutline, trashOutline, listOutline, arrowBackOutline });
  }

  volver(): void {
    this.router.navigate(['/admin/forms']);
  }

  ionViewWillEnter(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.template = id ? this.formService.getTemplate(id) : null;
    if (!this.template) this.router.navigate(['/admin/forms']);
  }

  // Paso 1: etiqueta y clave
  async agregarCampo(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Nuevo Campo (1/3)',
      subHeader: 'Identificación del campo',
      inputs: [
        { name: 'label', placeholder: 'Etiqueta (ej: Nombre del piloto)', type: 'text' },
        { name: 'name',  placeholder: 'Clave interna (ej: nombre_piloto)',  type: 'text' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Siguiente →',
          handler: (data) => {
            if (!data.label?.trim() || !data.name?.trim()) return false;
            this._bufferCampo = {
              label: data.label.trim(),
              name: data.name.trim().toLowerCase().replace(/\s+/g, '_'),
            };
            this._elegirTipo();
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  // Paso 2: tipo de campo
  private async _elegirTipo(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Tipo de campo (2/3)',
      inputs: [
        { type: 'radio', label: 'Texto',           value: 'text',     checked: true },
        { type: 'radio', label: 'Número',          value: 'number' },
        { type: 'radio', label: 'Fecha',           value: 'date' },
        { type: 'radio', label: 'Selección',       value: 'select' },
        { type: 'radio', label: 'Foto / Archivo',  value: 'file' },
        { type: 'radio', label: 'Ubicación GPS',   value: 'location' },
      ],
      buttons: [
        { text: 'Atrás', role: 'cancel' },
        {
          text: 'Siguiente →',
          handler: (tipo) => {
            this._bufferCampo = { ...this._bufferCampo, type: tipo ?? 'text' };
            this._elegirObligatorio();
          },
        },
      ],
    });
    await alert.present();
  }

  // Paso 3: ¿obligatorio?
  private async _elegirObligatorio(): Promise<void> {
    const esSelect = this._bufferCampo?.type === 'select';
    const alert = await this.alertCtrl.create({
      header: '¿Obligatorio? (3/3)',
      inputs: [
        { type: 'radio', label: 'Sí, es obligatorio', value: 'si', checked: true },
        { type: 'radio', label: 'No, es opcional',    value: 'no' },
      ],
      buttons: [
        { text: 'Atrás', role: 'cancel' },
        {
          text: esSelect ? 'Siguiente →' : 'Guardar',
          handler: (val) => {
            this._bufferCampo = { ...this._bufferCampo, required: val === 'si' };
            if (esSelect) {
              this._elegirOpciones();
            } else {
              this._guardarCampo();
            }
          },
        },
      ],
    });
    await alert.present();
  }

  // Paso 4 solo para tipo selección
  private async _elegirOpciones(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Opciones (4/4)',
      subHeader: 'Escribe las opciones separadas por coma',
      inputs: [
        { name: 'opciones', placeholder: 'Ej: Despejado, Nublado, Lluvia', type: 'text' },
      ],
      buttons: [
        { text: 'Atrás', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            const opts = (data.opciones ?? '')
              .split(',')
              .map((o: string) => o.trim())
              .filter((o: string) => o.length > 0);
            this._bufferCampo = { ...this._bufferCampo, options: opts };
            this._guardarCampo();
          },
        },
      ],
    });
    await alert.present();
  }

  private _guardarCampo(): void {
    if (!this.template || !this._bufferCampo) return;
    const campo = this._bufferCampo as FormField;
    this.formService.saveTemplate({
      ...this.template,
      fields: [...this.template.fields, campo],
    });
    this.template = this.formService.getTemplate(this.template.id);
    this._bufferCampo = null;
  }

  async eliminarCampo(index: number): Promise<void> {
    const campo = this.template?.fields[index];
    const alert = await this.alertCtrl.create({
      header: 'Eliminar campo',
      message: `¿Eliminar "${campo?.label}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            if (!this.template) return;
            const fields = this.template.fields.filter((_, i) => i !== index);
            this.formService.saveTemplate({ ...this.template!, fields });
            this.template = this.formService.getTemplate(this.template!.id);
          },
        },
      ],
    });
    await alert.present();
  }

  getTipoLabel(type: string): string {
    const labels: Record<string, string> = {
      text: 'Texto', number: 'Número', date: 'Fecha',
      select: 'Selección', file: 'Foto/Archivo', location: 'GPS',
    };
    return labels[type] ?? type;
  }

  getTipoColor(type: string): string {
    const colors: Record<string, string> = {
      text: 'primary', number: 'secondary', date: 'tertiary',
      select: 'warning', file: 'success', location: 'danger',
    };
    return colors[type] ?? 'medium';
  }
}
