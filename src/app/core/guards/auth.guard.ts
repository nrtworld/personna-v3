import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { getAuth } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const auth = getAuth();
    if (auth.currentUser) {
      return true;
    }
    
    this.router.navigate(['/login']);
    return false;
  }
} 