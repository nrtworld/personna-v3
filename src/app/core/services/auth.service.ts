import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  User
} from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = getAuth();
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private router: Router) {
    // Vérifier l'état initial de l'authentification
    const currentUser = this.auth.currentUser;
    this.userSubject.next(currentUser);

    onAuthStateChanged(this.auth, (user) => {
      console.log('Auth state changed:', user?.email);
      this.userSubject.next(user);
    });
  }

  async login(email: string, password: string): Promise<void> {
    try {
      console.log('Attempting login...');
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Login successful:', userCredential.user.email);
      
      // Attendre un court instant pour s'assurer que l'état d'authentification est mis à jour
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('Navigating to dashboard...');
      const result = await this.router.navigate(['/dashboard']);
      console.log('Navigation result:', result);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.userSubject.next(null);
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    const isAuth = this.auth.currentUser !== null;
    console.log('isAuthenticated:', isAuth);
    return isAuth;
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  async register(email: string, password: string): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log('Registration successful:', userCredential.user.email);
      await this.router.navigate(['/dashboard']);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Cet email est déjà utilisé');
      }
      throw error;
    }
  }
} 