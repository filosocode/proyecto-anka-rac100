import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonButton, IonBadge
} from '@ionic/angular/standalone';
import { FormEntry } from '../../shared/models/form.model';
import { StorageService } from '../../shared/services/storage.service';

@Component({
  selector: 'app-form-draft',
  templateUrl: './form-draft.page.html',
  styleUrls: ['./form-draft.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonBackButton, IonList, IonItem, IonLabel, IonButton, IonBadge],
})
export class FormDraftPage implements OnInit {
  drafts: FormEntry[] = [];

  constructor(private storage: StorageService, private router: Router) {}

  ngOnInit() { this.load(); }

  private load() {
    const keys = this.storage.keys().filter(k => k.startsWith('draft_'));
    this.drafts = keys.map(k => this.storage.get<FormEntry>(k)!).filter(Boolean);
  }

  open(draft: FormEntry) {
    this.router.navigate(['/forms/fill', draft.templateId]);
  }

  delete(draft: FormEntry) {
    this.storage.remove(draft.id);
    this.load();
  }
}
