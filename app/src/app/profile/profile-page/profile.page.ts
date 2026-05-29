import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonButton, IonBadge
} from '@ionic/angular/standalone';
import { AuthService } from '../../shared/services/auth.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonTitle, IonToolbar,
    IonList, IonItem, IonLabel, IonButton, IonBadge],
})
export class ProfilePage {
  user: User | null;

  constructor(private auth: AuthService, private router: Router) {
    this.user = this.auth.currentUser();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
