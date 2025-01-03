import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { CharacterService } from '../../core/services/character.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let characterService: jasmine.SpyObj<CharacterService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CharacterService', ['deleteCharacter'], {
      characters$: of([])
    });

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [DashboardComponent],
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

  it('should initialize characters observable', () => {
    expect(component.characters$).toBeTruthy();
  });
}); 