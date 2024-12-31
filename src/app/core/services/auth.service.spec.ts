import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import * as auth from 'firebase/auth';

describe('AuthService', () => {
  let service: AuthService;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    spyOn(auth, 'createUserWithEmailAndPassword').and.returnValue(Promise.resolve({
      user: { uid: 'test-uid', email: 'test@test.com' },
      providerId: 'firebase',
      operationType: 'signIn'
    } as auth.UserCredential));

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: router }
      ]
    });

    service = TestBed.inject(AuthService);
  });

  it('should register new user', async () => {
    await service.register('test@test.com', 'password123');
    expect(auth.createUserWithEmailAndPassword).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should handle registration error', async () => {
    const error = new Error('Email already in use');
    (auth.createUserWithEmailAndPassword as jasmine.Spy).and.rejectWith(error);
    
    await expectAsync(service.register('existing@test.com', 'password123'))
      .toBeRejectedWith(error);
  });
}); 