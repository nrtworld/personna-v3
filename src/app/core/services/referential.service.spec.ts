import { TestBed } from '@angular/core/testing';
import { ReferentialService } from './referential.service';
import { GameReferential } from '../../models/referential.model';
import { mockFirestore } from '../../../firebase-mock';
import { BehaviorSubject } from 'rxjs';

describe('ReferentialService', () => {
  let service: ReferentialService;
  const mockGame: GameReferential = {
    id: 'test-game',
    name: 'Test Game',
    stats: [
      {
        id: 'str',
        name: 'Force',
        description: 'Force physique',
        minValue: 0,
        maxValue: 10,
        defaultValue: 5
      }
    ],
    masteries: [
      {
        id: 'combat',
        name: 'Combat',
        description: 'Maîtrise du combat',
        relatedStats: ['str']
      }
    ],
    skills: [
      {
        id: 'climb',
        name: 'Escalade',
        description: 'Capacité à grimper',
        relatedStats: ['str'],
        relatedMasteries: ['combat']
      }
    ],
    traits: [
      {
        id: 'strong',
        name: 'Fort',
        description: 'Bonus de force',
        effects: [
          {
            type: 'bonus',
            target: 'str',
            value: 2
          }
        ]
      }
    ],
    itemTypes: [
      {
        id: 'weapon',
        name: 'Arme',
        description: 'Arme de combat',
        properties: ['damage', 'weight']
      }
    ]
  };

  beforeEach(() => {
    // Configuration des mocks
    mockFirestore.collection.and.returnValue({
      get: () => Promise.resolve({
        docs: [
          {
            id: mockGame.id,
            data: () => ({ ...mockGame })
          }
        ]
      })
    });

    mockFirestore.doc.and.returnValue({
      onSnapshot: (callback: any) => {
        callback({
          exists: () => true,
          id: mockGame.id,
          data: () => ({ ...mockGame })
        });
        return () => {};
      }
    });

    TestBed.configureTestingModule({
      providers: [ReferentialService]
    });

    service = TestBed.inject(ReferentialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load game referential', (done) => {
    service.loadGameReferential('test-game');

    service.currentGame$.subscribe(game => {
      if (game) {
        expect(game.id).toBe(mockGame.id);
        expect(game.name).toBe(mockGame.name);
        expect(game.stats).toEqual(mockGame.stats);
        expect(game.masteries).toEqual(mockGame.masteries);
        expect(game.skills).toEqual(mockGame.skills);
        expect(game.traits).toEqual(mockGame.traits);
        expect(game.itemTypes).toEqual(mockGame.itemTypes);
        done();
      }
    });
  });

  it('should get available games', async () => {
    const games = await service.getAvailableGames();
    expect(games.length).toBe(1);
    expect(games[0]).toEqual(mockGame);
  });

  it('should get available stats', (done) => {
    (service as any).currentGameSubject.next(mockGame);

    service.getAvailableStats().subscribe(stats => {
      expect(stats).toEqual(mockGame.stats);
      done();
    });
  });

  it('should get available masteries', (done) => {
    (service as any).currentGameSubject.next(mockGame);

    service.getAvailableMasteries().subscribe(masteries => {
      expect(masteries).toEqual(mockGame.masteries);
      done();
    });
  });

  it('should get available skills', (done) => {
    (service as any).currentGameSubject.next(mockGame);

    service.getAvailableSkills().subscribe(skills => {
      expect(skills).toEqual(mockGame.skills);
      done();
    });
  });

  it('should get available traits', (done) => {
    (service as any).currentGameSubject.next(mockGame);

    service.getAvailableTraits().subscribe(traits => {
      expect(traits).toEqual(mockGame.traits);
      done();
    });
  });

  it('should get available item types', (done) => {
    (service as any).currentGameSubject.next(mockGame);

    service.getAvailableItemTypes().subscribe(itemTypes => {
      expect(itemTypes).toEqual(mockGame.itemTypes);
      done();
    });
  });

  it('should calculate trait effects', (done) => {
    (service as any).currentGameSubject.next(mockGame);

    service.calculateTraitEffects(['strong']).subscribe(effects => {
      expect(effects['str']).toBe(2);
      done();
    });
  });

  it('should handle missing game for trait effects', (done) => {
    (service as any).currentGameSubject.next(null);

    service.calculateTraitEffects(['strong']).subscribe(effects => {
      expect(effects).toEqual({});
      done();
    });
  });

  it('should cleanup listeners on destroy', () => {
    const unsubscribeSpy = jasmine.createSpy('unsubscribe');
    (service as any).unsubscribeGame = unsubscribeSpy;

    service.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
