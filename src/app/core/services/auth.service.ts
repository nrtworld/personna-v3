import { Injectable } from '@angular/core';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  Auth,
  User 
} from 'firebase/auth';
import { getApp } from 'firebase/app';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth;
  private userSubject: BehaviorSubject<User | null>;
  public user$: Observable<User | null>;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.auth = getAuth(getApp());
    this.userSubject = new BehaviorSubject<User | null>(null);
    this.user$ = this.userSubject.asObservable();

    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    });
  }

  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      
      // Récupérer l'URL de retour depuis les query params
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
      await this.router.navigate([returnUrl]);
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      await this.router.navigate(['/login']);
    } catch (error) {
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  async register(email: string, password: string): Promise<void> {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
      await this.router.navigate(['/dashboard']);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Cet email est déjà utilisé');
      }
      throw error;
    }
  }
} 