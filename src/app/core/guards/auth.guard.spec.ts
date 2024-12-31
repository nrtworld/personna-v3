import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { User } from 'firebase/auth';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: Router;
  let userSubject: BehaviorSubject<User | null>;

  beforeEach(() => {
    userSubject = new BehaviorSubject<User | null>(null);
    
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated'], {
      user$: userSubject.asObservable()
    });

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect to login when user is not authenticated', (done) => {
    const routerSpy = spyOn(router, 'createUrlTree');
    const mockRoute = {} as any;
    const mockState = { url: '/protected' } as any;

    guard.canActivate(mockRoute, mockState).subscribe(() => {
      expect(routerSpy).toHaveBeenCalledWith(['/login'], {
        queryParams: { returnUrl: '/protected' }
      });
      done();
    });
  });

  it('should allow access when user is authenticated', (done) => {
    const mockUser = { uid: 'test-uid' } as User;
    userSubject.next(mockUser);

    const mockRoute = {} as any;
    const mockState = { url: '/protected' } as any;

    guard.canActivate(mockRoute, mockState).subscribe(result => {
      expect(result).toBe(true);
      done();
    });
  });
}); 