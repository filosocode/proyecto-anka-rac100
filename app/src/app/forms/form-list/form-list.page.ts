import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonButton, IonBadge
} from '@ionic/angular/standalone';
import { FormTemplate } from '../../shared/models/form.model';
import { StorageService } from '../../shared/services/storage.service';

@Component({
  selector: 'app-form-list',
  templateUrl: './form-list.page.html',
  styleUrls: ['./form-list.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonButton, IonBadge],
})
export class FormListPage implements OnInit {
  templates: FormTemplate[] = [];

  constructor(private storage: StorageService, private router: Router) {}

  ngOnInit() {
    // TODO RF2: cargar plantillas desde API
    this.templates = this.storage.get<FormTemplate[]>('form_templates') ?? [];
  }

  open(template: FormTemplate) {
    this.router.navigate(['/forms/fill', template.id]);
  }

  openDrafts() {
    this.router.navigate(['/forms/drafts']);
  }
}
