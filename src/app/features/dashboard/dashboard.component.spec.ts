import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { CharacterService } from '../../core/services/character.service';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CharacterCardComponent } from './character-card/character-card.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let characterService: jasmine.SpyObj<CharacterService>;

  const mockCharacters = [
    { id: '1', name: 'Aragorn', game: 'dnd', userId: '123', xp: 0 },
    { id: '2', name: 'Gandalf', game: 'dnd', userId: '123', xp: 0 },
    { id: '3', name: 'Conan', game: 'pathfinder', userId: '123', xp: 0 }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CharacterService', ['getUserCharacters', 'deleteCharacter']);
    spy.getUserCharacters.and.returnValue(of(mockCharacters));

    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [ DashboardComponent, CharacterCardComponent ],
      providers: [
        { provide: CharacterService, useValue: spy }
      ]
    }).compileComponents();

    characterService = TestBed.inject(CharacterService) as jasmine.SpyObj<CharacterService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load characters on init', () => {
    expect(characterService.getUserCharacters).toHaveBeenCalled();
  });

  it('should filter characters by search term', () => {
    component.searchTerm = 'ara';
    component.filterCharacters();
    
    component.characters$.subscribe(chars => {
      expect(chars.length).toBe(1);
      expect(chars[0].name).toBe('Aragorn');
    });
  });

  it('should filter characters by game', () => {
    component.selectedGame = 'pathfinder';
    component.filterCharacters();
    
    component.characters$.subscribe(chars => {
      expect(chars.length).toBe(1);
      expect(chars[0].name).toBe('Conan');
    });
  });

  it('should sort characters by name', () => {
    component.sortOrder = 'desc';
    component.filterCharacters();
    
    component.characters$.subscribe(chars => {
      expect(chars[0].name).toBe('Gandalf');
    });
  });
}); 