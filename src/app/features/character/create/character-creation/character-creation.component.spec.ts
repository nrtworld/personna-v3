import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CharacterCreationComponent } from './character-creation.component';
import { CharacterService } from '../../../../core/services/character.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('CharacterCreationComponent', () => {
  let component: CharacterCreationComponent;
  let fixture: ComponentFixture<CharacterCreationComponent>;
  let characterService: jasmine.SpyObj<CharacterService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const characterServiceSpy = jasmine.createSpyObj('CharacterService', ['addCharacter']);
    characterServiceSpy.addCharacter.and.returnValue(Promise.resolve());

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        CharacterCreationComponent,
        RouterTestingModule
      ],
      providers: [
        { provide: CharacterService, useValue: characterServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    characterService = TestBed.inject(CharacterService) as jasmine.SpyObj<CharacterService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Navigation between steps', () => {
    it('should start at step 1', () => {
      expect(component.currentStep).toBe(1);
    });

    it('should not allow going back from step 1', () => {
      component.previousStep();
      expect(component.currentStep).toBe(1);
    });

    it('should not allow proceeding without valid data', () => {
      expect(component.canProceed()).toBeFalse();
      component.nextStep();
      expect(component.currentStep).toBe(1);
    });

    it('should allow proceeding with valid data', () => {
      // Simuler des données valides pour l'étape 1
      component.onIdentitySubmit({
        name: 'Test Character',
        maxHp: 10,
        currentHp: 10
      });
      
      expect(component.canProceed()).toBeTrue();
      component.nextStep();
      expect(component.currentStep).toBe(2);
    });
  });

  describe('Form validation', () => {
    it('should validate identity data', () => {
      component.onIdentitySubmit({
        name: '',
        maxHp: 0,
        currentHp: 0
      });

      expect(component.getCurrentErrors().length).toBeGreaterThan(0);
      expect(component.validationState.identity).toBeFalse();
    });

    it('should validate stats allocation', () => {
      component.onStatsSubmit({
        'Force': 10,
        'Dextérité': 15 // Total > 20
      });

      expect(component.getCurrentErrors().length).toBeGreaterThan(0);
      expect(component.validationState.stats).toBeFalse();
    });

    it('should validate masteries allocation', () => {
      component.onMasteriesSubmit({
        'Combat': 8,
        'Furtivité': 8 // Total > 15
      });

      expect(component.validationState.masteries).toBeFalse();
    });

    it('should validate traits selection', () => {
      component.onTraitsSubmit([
        { name: 'Trait 1' },
        { name: 'Trait 2' },
        { name: 'Trait 3' },
        { name: 'Trait 4' } // Plus de 3 traits
      ]);

      expect(component.validationState.traits).toBeFalse();
    });
  });

  describe('Character saving', () => {
    it('should not save invalid character', async () => {
      await component.saveCharacter();
      expect(characterService.addCharacter).not.toHaveBeenCalled();
    });

    it('should save valid character and redirect', async () => {
      // Simuler un personnage valide
      component.characterState = {
        name: 'Test',
        maxHp: 10,
        currentHp: 10,
        stats: { 'Force': { value: 10 } },
        masteries: [{ id: '1', name: 'Combat', level: 5 }],
        skills: [{ id: '2', name: 'Escalade', level: 2 }],
        traits: [{ 
          id: '3',
          name: 'Courageux',
          description: 'Description du trait'
        }],
        inventory: {
          items: [],
          dices: [],
          currentWeight: 0,
          maxWeight: 100
        },
        notes: []
      };

      // Mock du service pour accepter le type CharacterCreationState
      characterService.addCharacter.and.returnValue(Promise.resolve('mock-id'));

      // Simuler la validation
      Object.keys(component.validationState).forEach(key => {
        component.validationState[key as keyof typeof component.validationState] = true;
      });

      await component.saveCharacter();

      // Vérifier que la méthode a été appelée avec les bonnes données
      expect(characterService.addCharacter).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
    });

    it('should handle save errors', async () => {
      // Simuler une erreur lors de la sauvegarde
      characterService.addCharacter.and.rejectWith(new Error('Save failed'));

      // Simuler un personnage valide
      Object.keys(component.validationState).forEach(key => {
        component.validationState[key as keyof typeof component.validationState] = true;
      });

      spyOn(console, 'error');
      await component.saveCharacter();

      expect(console.error).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Error handling', () => {
    it('should display current step errors', () => {
      component.validationErrors = {
        identity: ['Le nom est requis']
      };

      expect(component.getCurrentErrors()).toEqual(['Le nom est requis']);
    });

    it('should clear errors when valid data is submitted', () => {
      component.validationErrors = {
        identity: ['Le nom est requis']
      };

      component.onIdentitySubmit({
        name: 'Test Character',
        maxHp: 10,
        currentHp: 10
      });

      expect(component.getCurrentErrors().length).toBe(0);
    });
  });
}); 