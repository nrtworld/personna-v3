import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  Router, 
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot 
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.user$.pipe(
      take(1),
      map(user => {
        if (user) {
          return true;
        }
        
        // Stocker l'URL demandée pour redirection post-login
        const returnUrl = state.url;
        return this.router.createUrlTree(['/login'], {
          queryParams: { returnUrl }
        });
      })
    );
  }
} 