import { Component } from '@angular/core';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, 
  IonButtons, IonBackButton, IonList, IonItem, 
  IonLabel, IonIcon, IonButton, IonItemSliding, 
  IonItemOptions, IonItemOption 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-form-draft',
  templateUrl: 'form-draft.page.html',
  standalone: true, // Esto es vital
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonBackButton, IonList, IonItem,
    IonLabel, IonIcon, IonButton, IonItemSliding,
    IonItemOptions, IonItemOption
  ],
})
export class FormDraftPage {
}
