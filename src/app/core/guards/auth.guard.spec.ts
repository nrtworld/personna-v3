import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthGuard } from './auth.guard';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeAll(() => {
    // Initialize Firebase for tests
    const firebaseConfig = {
      apiKey: 'test',
      authDomain: 'test',
      projectId: 'test',
      storageBucket: 'test',
      messagingSenderId: 'test',
      appId: 'test'
    };
    initializeApp(firebaseConfig);
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [AuthGuard]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should redirect to login when not authenticated', async () => {
    const auth = getAuth();
    const result = await guard.canActivate();
    expect(result).toBeFalsy();
  });

  it('should allow access when authenticated', async () => {
    const auth = getAuth();
    // Mock authenticated user
    Object.defineProperty(auth, 'currentUser', {
      value: { uid: 'test-uid' },
      configurable: true
    });
    
    const result = await guard.canActivate();
    expect(result).toBeTruthy();
  });
}); 