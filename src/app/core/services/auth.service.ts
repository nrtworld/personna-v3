import { Injectable } from '@angular/core';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  Auth,
  User 
} from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth;
  private userSubject: BehaviorSubject<User | null>;
  public user$: Observable<User | null>;

  constructor(private router: Router) {
    this.auth = getAuth();
    this.userSubject = new BehaviorSubject<User | null>(null);
    this.user$ = this.userSubject.asObservable();

    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    });
  }

  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error) {
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }
} 