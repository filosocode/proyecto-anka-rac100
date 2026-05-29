import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
    // TODO 1: validar que email y password no estén vacíos.
    //   Si alguno está vacío, asigna un mensaje a this.errorMessage y haz return.
    //   Ejemplo: this.errorMessage = 'Por favor completa todos los campos.';

    this.loading = true;
    this.errorMessage = '';

    // TODO 2: llamar a this.auth.login(this.email, this.password)
    //   Guarda el resultado (true/false) en una variable "ok".
    //   Ejemplo: const ok = this.auth.login(this.email, this.password);
    const ok = false; // ← reemplaza esto con la línea del TODO 2

    this.loading = false;

    if (!ok) {
      // TODO 3: si el login falló, mostrar un mensaje de error.
      //   Asigna a this.errorMessage algo como:
      //   'Correo o contraseña incorrectos. Intenta de nuevo.'
      return;
    }

    // TODO 4: si el login fue exitoso, redirigir según el rol del usuario.
    //   Usa this.auth.isAdmin() para saber si es administrador.
    //   - Si es admin  → navegar a '/admin/drones'
    //   - Si es piloto → navegar a '/home/forms'
    //   Usa: this.router.navigate(['/ruta'])
  }
}
