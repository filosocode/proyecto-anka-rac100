import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButton, IonInput, IonItem, IonLabel, IonNote
} from '@ionic/angular/standalone';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButton, IonInput, IonItem, IonLabel, IonNote
  ],
})
export class LoginPage {
  form: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async login() {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;
    const user = await this.auth.login(email, password);
    if (!user) return; // TODO: mostrar toast de error
    if (user.role === 'admin') {
      this.router.navigate(['/admin/users']);
    } else {
      this.router.navigate(['/forms']);
    }
  }
}
