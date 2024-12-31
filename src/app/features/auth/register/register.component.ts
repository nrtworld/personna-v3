import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  template: `
    <div class="login-container">
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <h2>Créer un compte</h2>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" formControlName="email">
          <div *ngIf="registerForm.get('email')?.errors?.['required'] && registerForm.get('email')?.touched">
            L'email est requis
          </div>
          <div *ngIf="registerForm.get('email')?.errors?.['email'] && registerForm.get('email')?.touched">
            Format d'email invalide
          </div>
        </div>
        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input type="password" id="password" formControlName="password">
          <div *ngIf="registerForm.get('password')?.errors?.['required'] && registerForm.get('password')?.touched">
            Le mot de passe est requis
          </div>
          <div *ngIf="registerForm.get('password')?.errors?.['pattern'] && registerForm.get('password')?.touched">
            Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial
          </div>
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirmer le mot de passe</label>
          <input type="password" id="confirmPassword" formControlName="confirmPassword">
          <div *ngIf="registerForm.errors?.['passwordMismatch'] && registerForm.get('confirmPassword')?.touched">
            Les mots de passe ne correspondent pas
          </div>
        </div>
        <button type="submit" [disabled]="registerForm.invalid">S'inscrire</button>
        <div *ngIf="error" class="error-message">
          {{error}}
        </div>
        <div class="login-link">
          <a routerLink="/login">Déjà un compte ? Se connecter</a>
        </div>
      </form>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null
      : { passwordMismatch: true };
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      try {
        const { email, password } = this.registerForm.value;
        await this.authService.register(email, password);
      } catch (error: any) {
        this.error = error.message;
      }
    }
  }
} 