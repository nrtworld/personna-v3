import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['register']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RegisterComponent],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form initially', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('should validate email format', () => {
    const email = component.registerForm.controls['email'];
    email.setValue('invalid-email');
    expect(email.errors?.['email']).toBeTruthy();
    
    email.setValue('valid@email.com');
    expect(email.errors?.['email']).toBeFalsy();
  });

  it('should validate password strength', () => {
    const password = component.registerForm.controls['password'];
    password.setValue('weak');
    expect(password.errors?.['pattern']).toBeTruthy();
    
    password.setValue('StrongPass123!');
    expect(password.errors?.['pattern']).toBeFalsy();
  });

  it('should validate password confirmation match', () => {
    const password = component.registerForm.controls['password'];
    const confirmPassword = component.registerForm.controls['confirmPassword'];
    
    password.setValue('StrongPass123!');
    confirmPassword.setValue('DifferentPass123!');
    expect(component.registerForm.errors?.['passwordMismatch']).toBeTruthy();
    
    confirmPassword.setValue('StrongPass123!');
    expect(component.registerForm.errors?.['passwordMismatch']).toBeFalsy();
  });

  it('should handle registration success', async () => {
    authService.register.and.returnValue(Promise.resolve());
    
    component.registerForm.setValue({
      email: 'test@test.com',
      password: 'StrongPass123!',
      confirmPassword: 'StrongPass123!'
    });

    await component.onSubmit();
    
    expect(authService.register).toHaveBeenCalledWith('test@test.com', 'StrongPass123!');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should handle registration error', async () => {
    const error = new Error('Email already in use');
    authService.register.and.returnValue(Promise.reject(error));
    
    component.registerForm.setValue({
      email: 'existing@test.com',
      password: 'StrongPass123!',
      confirmPassword: 'StrongPass123!'
    });

    await component.onSubmit();
    
    expect(component.error).toBeTruthy();
  });
}); 