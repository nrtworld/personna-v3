import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AuthService } from './core/services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { User } from 'firebase/auth';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let userSubject: BehaviorSubject<User | null>;

  beforeEach(async () => {
    userSubject = new BehaviorSubject<User | null>(null);
    
    authService = jasmine.createSpyObj('AuthService', ['logout'], {
      user$: userSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppComponent],
      providers: [
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show logout button when user is not authenticated', () => {
    const logoutButton = fixture.nativeElement.querySelector('.logout-btn');
    expect(logoutButton).toBeNull();
  });

  it('should show logout button when user is authenticated', () => {
    userSubject.next({ uid: 'test-uid' } as User);
    fixture.detectChanges();
    
    const logoutButton = fixture.nativeElement.querySelector('.logout-btn');
    expect(logoutButton).toBeTruthy();
  });

  it('should call logout method when logout button is clicked', async () => {
    userSubject.next({ uid: 'test-uid' } as User);
    fixture.detectChanges();
    
    const logoutButton = fixture.nativeElement.querySelector('.logout-btn');
    logoutButton.click();
    
    expect(authService.logout).toHaveBeenCalled();
  });
}); 