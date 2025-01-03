import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TraitsFormComponent } from './traits-form.component';
import { CharacterTrait } from '../../../../models/database.model';
import { FormsModule } from '@angular/forms';

describe('TraitsFormComponent', () => {
  let component: TraitsFormComponent;
  let fixture: ComponentFixture<TraitsFormComponent>;

  const mockTraits: CharacterTrait[] = [
    { name: 'Courageux', description: 'N\'a peur de rien' },
    { name: 'Prudent', description: 'Réfléchit avant d\'agir' },
    { name: 'Loyal', description: 'Fidèle à ses amis' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraitsFormComponent, FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TraitsFormComponent);
    component = fixture.componentInstance;
    component.availableTraits = mockTraits;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter traits based on search term', () => {
    component.searchTerm = 'cour';
    expect(component.filteredTraits.length).toBe(1);
    expect(component.filteredTraits[0].name).toBe('Courageux');
  });

  it('should toggle trait selection', () => {
    const trait = mockTraits[0];
    
    component.toggleTrait(trait);
    expect(component.selectedTraits).toContain(trait);
    
    component.toggleTrait(trait);
    expect(component.selectedTraits).not.toContain(trait);
  });

  it('should not allow more than maxTraits selections', () => {
    component.maxTraits = 2;
    
    component.toggleTrait(mockTraits[0]);
    component.toggleTrait(mockTraits[1]);
    component.toggleTrait(mockTraits[2]);
    
    expect(component.selectedTraits.length).toBe(2);
  });

  it('should emit selected traits when changed', () => {
    spyOn(component.traitsSelected, 'emit');
    
    component.toggleTrait(mockTraits[0]);
    
    expect(component.traitsSelected.emit).toHaveBeenCalledWith([mockTraits[0]]);
  });

  it('should remove trait correctly', () => {
    component.toggleTrait(mockTraits[0]);
    component.removeTrait(mockTraits[0]);
    
    expect(component.selectedTraits.length).toBe(0);
  });
}); 