import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton, IonContent, IonInput, IonIcon, IonSpinner,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, arrowForwardOutline, alertCircleOutline, shieldCheckmarkOutline, informationCircleOutline } from 'ionicons/icons';
import { DroneComponent } from '../../shared/components/drone/drone.component';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrl: './login.page.scss',
  imports: [
    FormsModule, RouterLink,
    IonContent, IonInput, IonButton, IonIcon, IonSpinner,
    DroneComponent,
  ],
})
export class LoginPage {
  email    = '';
  password = '';
  errorMessage = '';
  loading      = false;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {
    addIcons({ mailOutline, lockClosedOutline, arrowForwardOutline, alertCircleOutline, shieldCheckmarkOutline, informationCircleOutline });
  }

  login(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos.';
      return;
    }
    this.loading = true;
    this.errorMessage = '';
    const ok = this.auth.login(this.email, this.password);
    this.loading = false;
    if (!ok) {
      this.errorMessage = 'Correo o contraseña incorrectos.';
      return;
    }
    this.router.navigate([this.auth.isAdmin() ? '/admin/drones' : '/home/forms']);
  }
}
