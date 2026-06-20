import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton, IonContent, IonInput, IonItem,
  IonLabel, IonNote, IonText, IonSpinner,
} from '@ionic/angular/standalone';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    FormsModule,
    IonContent, IonItem, IonLabel, IonInput,
    IonButton, IonNote, IonText, IonSpinner,
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
  ) {}

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
