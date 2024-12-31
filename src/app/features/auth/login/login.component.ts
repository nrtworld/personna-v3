import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <h2>Connexion</h2>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" formControlName="email">
          <div *ngIf="loginForm.get('email')?.errors?.['required'] && loginForm.get('email')?.touched">
            L'email est requis
          </div>
          <div *ngIf="loginForm.get('email')?.errors?.['email'] && loginForm.get('email')?.touched">
            Format d'email invalide
          </div>
        </div>
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input type="password" id="password" formControlName="password">
          <div *ngIf="loginForm.get('password')?.errors?.['required'] && loginForm.get('password')?.touched">
            Le mot de passe est requis
          </div>
        </div>
        <button type="submit" [disabled]="loginForm.invalid">Se connecter</button>
        <div *ngIf="error" class="error-message">
          {{error}}
        </div>
      </form>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      try {
        const { email, password } = this.loginForm.value;
        await this.authService.login(email, password);
        this.error = '';
      } catch (error) {
        console.error('Login failed:', error);
        this.error = 'Échec de la connexion. Veuillez vérifier vos identifiants.';
      }
    }
  }
} 