import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterCardComponent } from './character-card.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('CharacterCardComponent', () => {
  let component: CharacterCardComponent;
  let fixture: ComponentFixture<CharacterCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ CharacterCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterCardComponent);
    component = fixture.componentInstance;
    component.character = {
      id: '1',
      name: 'Test Character',
      game: 'dnd',
      userId: '123',
      xp: 0
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit delete event when confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(component.deleteCharacter, 'emit');
    
    component.confirmDelete();
    
    expect(component.deleteCharacter.emit).toHaveBeenCalledWith('1');
  });

  it('should not emit delete event when cancelled', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    spyOn(component.deleteCharacter, 'emit');
    
    component.confirmDelete();
    
    expect(component.deleteCharacter.emit).not.toHaveBeenCalled();
  });
}); 