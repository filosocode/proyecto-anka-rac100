import { Component } from '@angular/core';
import {
  IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentTextOutline, timeOutline, personOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home-tabs',
  templateUrl: 'home-tabs.page.html',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class HomeTabsPage {
  constructor() {
    addIcons({ documentTextOutline, timeOutline, personOutline });
  }
}
