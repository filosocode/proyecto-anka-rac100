import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonIcon, IonBadge, IonButton, IonButtons,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonChip, IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  documentTextOutline, addOutline, archiveOutline,
  clipboardOutline, chevronForwardOutline,
} from 'ionicons/icons';
import { FormTemplate } from '../../shared/models/form.model';
import { FormService } from '../../shared/services/form.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-form-list',
  templateUrl: 'form-list.page.html',
  styleUrl: './form-list.page.scss',
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonIcon, IonBadge, IonButton, IonButtons,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonChip, IonLabel,
  ],
})
export class FormListPage implements OnInit {

  templates: FormTemplate[] = [];
  draftCount  = 0;
  userName    = 'Piloto';

  constructor(
    private formService: FormService,
    private auth: AuthService,
    private router: Router,
  ) {
    addIcons({ documentTextOutline, addOutline, archiveOutline, clipboardOutline, chevronForwardOutline });
  }

  ngOnInit(): void { this._cargar(); }

  ionViewWillEnter(): void { this._cargar(); }

  private _cargar(): void {
    this.templates  = this.formService.getTemplates().filter(t => t.active);
    this.draftCount = this.formService.getDrafts().length;
    this.userName   = this.auth.currentUser()?.name?.split(' ')[0] ?? 'Piloto';
  }

  abrirFormulario(templateId: string): void {
    this.router.navigate(['/home/forms/fill', templateId]);
  }

  verBorradores(): void {
    this.router.navigate(['/home/forms/draft']);
  }
}
