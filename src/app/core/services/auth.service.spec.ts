import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

describe('AuthService', () => {
  let service: AuthService;

  beforeAll(() => {
    // Initialize Firebase for tests if not already initialized
    try {
      getAuth();
    } catch {
      const firebaseConfig = {
        apiKey: 'test',
        authDomain: 'test',
        projectId: 'test',
        storageBucket: 'test',
        messagingSenderId: 'test',
        appId: 'test'
      };
      initializeApp(firebaseConfig);
    }
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
  });

  it('should handle invalid credentials', async () => {
    try {
      await service.login('test@test.com', 'wrongpassword');
      fail('Should have thrown an error');
    } catch (error: any) {
      expect(error.message).toBe('Invalid credentials');
    }
  });

  // Other tests...
}); 