import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonText,
  IonSpinner,
} from '@ionic/angular/standalone';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  imports: [
    FormsModule,
    RouterLink,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonNote,
    IonText,
    IonSpinner,
  ],
})
export class LoginPage {
  // ── Datos del formulario ─────────────────────────────────────────
  email = '';
  password = '';

  // ── Estado de la UI ──────────────────────────────────────────────
  errorMessage = '';   // Mensaje de error visible en pantalla
  loading = false;     // Muestra spinner mientras intenta ingresar

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  // ── Acción principal: iniciar sesión ─────────────────────────────
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
      this.errorMessage = 'Correo o contraseña incorrectos. Intenta de nuevo.';
      return;
    }

    this.router.navigate([this.auth.isAdmin() ? '/admin/drones' : '/home/forms']);
  }
}
