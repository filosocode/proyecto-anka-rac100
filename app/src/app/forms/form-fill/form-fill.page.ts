import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonInput, IonButton, IonNote
} from '@ionic/angular/standalone';
import { FormTemplate, FormEntry } from '../../shared/models/form.model';
import { StorageService } from '../../shared/services/storage.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-form-fill',
  templateUrl: './form-fill.page.html',
  styleUrls: ['./form-fill.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonList, IonItem, IonLabel, IonInput, IonButton, IonNote],
})
export class FormFillPage implements OnInit {
  template!: FormTemplate;
  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private storage: StorageService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const templates = this.storage.get<FormTemplate[]>('form_templates') ?? [];
    this.template = templates.find(t => t.id === id) ?? { id: '', title: 'Formulario', fields: [] };
    const controls: Record<string, any> = {};
    for (const field of this.template.fields) {
      controls[field.name] = ['', field.required ? Validators.required : []];
    }
    this.form = this.fb.group(controls);
  }

  // RF4: guardar borrador offline
  saveDraft() {
    const entry: FormEntry = {
      id: `draft_${Date.now()}`,
      templateId: this.template.id,
      pilotId: this.auth.currentUser()?.id ?? '',
      data: this.form.value,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.storage.set(entry.id, entry);
    this.router.navigate(['/forms']);
  }

  // RF3: diligenciar y enviar
  submit() {
    if (this.form.invalid) return;
    const entry: FormEntry = {
      id: `entry_${Date.now()}`,
      templateId: this.template.id,
      pilotId: this.auth.currentUser()?.id ?? '',
      data: this.form.value,
      status: 'submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const history = this.storage.get<FormEntry[]>('history') ?? [];
    history.push(entry);
    this.storage.set('history', history);
    this.router.navigate(['/forms']);
  }
}
