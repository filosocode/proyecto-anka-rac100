import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButton, IonIcon, IonButtons,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { lockClosedOutline, arrowBackOutline, mailOutline } from 'ionicons/icons';

@Component({
  selector: 'app-recover',
  templateUrl: 'recover.page.html',
  styleUrl: './recover.page.scss',
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButton, IonIcon, IonButtons,
  ],
})
export class RecoverPage {

  constructor(private router: Router) {
    addIcons({ lockClosedOutline, arrowBackOutline, mailOutline });
  }

  volver(): void {
    this.router.navigate(['/login']);
  }
}