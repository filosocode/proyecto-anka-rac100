import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngIf y *ngFor
import { FormsModule } from '@angular/forms';   // Necesario para [(ngModel)]
import { 
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButtons, IonBackButton, IonList, IonItem,
  IonLabel, IonInput, IonSelect, IonSelectOption,
  IonButton, IonText 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-form-fill',
  templateUrl: 'form-fill.page.html',
  standalone: true,
  imports: [
    CommonModule, FormsModule, // <--- Obligatorios
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonBackButton, IonList, IonItem,
    IonLabel, IonInput, IonSelect, IonSelectOption,
    IonButton, IonText
  ],
})
export class FormFillPage {}
