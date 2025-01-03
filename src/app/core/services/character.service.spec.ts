import { TestBed } from '@angular/core/testing';
import { CharacterService } from './character.service';
import { mockFirestore } from '../../firebase-mock';
import { AuthService } from './auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { Character } from '../../models/database.model';

describe('CharacterService', () => {
  let service: CharacterService;
  let authService: jasmine.SpyObj<AuthService>;
  let userSubject: BehaviorSubject<any>;

  beforeEach(() => {
    userSubject = new BehaviorSubject(null);
    
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUserId'], {
      user$: userSubject.asObservable()
    });

    TestBed.configureTestingModule({
      providers: [
        CharacterService,
        { provide: 'Firestore', useValue: mockFirestore },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(CharacterService);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize characters listener when user logs in', (done) => {
    const mockUser = { uid: 'test-user' };
    const mockCharacters: Character[] = [
      {
        id: '1',
        name: 'Test Character',
        userId: 'test-user',
        game: 'default',
        xp: 0,
        maxHp: 10,
        currentHp: 10,
        stats: {},
        masteries: [],
        skills: [],
        traits: [],
        inventory: { items: [], dices: [], currentWeight: 0 },
        notes: []
      }
    ];

    // Simuler la connexion d'un utilisateur
    userSubject.next(mockUser);

    service.characters$.subscribe(characters => {
      if (characters.length > 0) {
        expect(characters).toEqual(mockCharacters);
        done();
      }
    });

    // Simuler une mise à jour de Firestore
    const mockSnapshot = {
      docs: [{
        id: '1',
        data: () => ({
          name: 'Test Character',
          userId: 'test-user',
          game: 'default',
          xp: 0
          // ... autres propriétés
        })
      }]
    };

    // Déclencher l'événement onSnapshot
    const mockQuery = mockFirestore.collection.calls.mostRecent().returnValue;
    mockQuery.onSnapshot.calls.mostRecent().args[0](mockSnapshot);
  });

  it('should cleanup listeners when user logs out', () => {
    const unsubscribeSpy = jasmine.createSpy('unsubscribe');
    service['unsubscribeCharacters'] = unsubscribeSpy;
    service['unsubscribeCurrentCharacter'] = unsubscribeSpy;

    userSubject.next(null);

    expect(unsubscribeSpy).toHaveBeenCalledTimes(2);
    expect(service['charactersSubject'].value).toEqual([]);
    expect(service['currentCharacterSubject'].value).toBeNull();
  });
}); 