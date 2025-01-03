import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MasteriesFormComponent } from './masteries-form.component';
import { Mastery } from '../../../../models/database.model';

describe('MasteriesFormComponent', () => {
  let component: MasteriesFormComponent;
  let fixture: ComponentFixture<MasteriesFormComponent>;

  const mockMasteries: Mastery[] = [
    { name: 'Combat', description: 'Maîtrise des armes' },
    { name: 'Furtivité', description: 'Capacité à se cacher' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MasteriesFormComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasteriesFormComponent);
    component = fixture.componentInstance;
    component.masteries = mockMasteries;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct points', () => {
    expect(component.remainingPoints).toBe(15);
    expect(component.allocatedMasteries.length).toBe(2);
    expect(component.allocatedMasteries[0].points).toBe(0);
  });

  it('should increment mastery points', () => {
    const mastery = component.allocatedMasteries[0];
    component.incrementMastery(mastery);
    expect(mastery.points).toBe(1);
    expect(component.remainingPoints).toBe(14);
  });

  it('should not increment beyond max points', () => {
    const mastery = component.allocatedMasteries[0];
    for (let i = 0; i < 4; i++) {
      component.incrementMastery(mastery);
    }
    expect(mastery.points).toBe(3);
    expect(component.remainingPoints).toBe(12);
  });

  it('should emit updated masteries', () => {
    spyOn(component.masteriesAllocated, 'emit');
    const mastery = component.allocatedMasteries[0];
    component.incrementMastery(mastery);
    
    expect(component.masteriesAllocated.emit).toHaveBeenCalledWith({
      'Combat': 1,
      'Furtivité': 0
    });
  });
}); 