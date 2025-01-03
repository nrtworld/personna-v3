import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatsFormComponent } from './stats-form.component';
import { BaseStatistic } from '../../../../models/database.model';

describe('StatsFormComponent', () => {
  let component: StatsFormComponent;
  let fixture: ComponentFixture<StatsFormComponent>;

  const mockStats: BaseStatistic[] = [
    { name: 'Force', description: 'Force physique' },
    { name: 'Dextérité', description: 'Agilité et précision' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsFormComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsFormComponent);
    component = fixture.componentInstance;
    component.baseStats = mockStats;
    component.availablePoints = 10;
    component.maxPointsPerStat = 5;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct points', () => {
    expect(component.remainingPoints).toBe(10);
    expect(component.allocatedStats.length).toBe(2);
    expect(component.allocatedStats[0].points).toBe(0);
  });

  it('should increment stat points', () => {
    const stat = component.allocatedStats[0];
    component.incrementStat(stat);
    expect(stat.points).toBe(1);
    expect(component.remainingPoints).toBe(9);
  });

  it('should not increment beyond max points', () => {
    const stat = component.allocatedStats[0];
    for (let i = 0; i < 6; i++) {
      component.incrementStat(stat);
    }
    expect(stat.points).toBe(5);
    expect(component.remainingPoints).toBe(5);
  });

  it('should decrement stat points', () => {
    const stat = component.allocatedStats[0];
    component.incrementStat(stat);
    component.decrementStat(stat);
    expect(stat.points).toBe(0);
    expect(component.remainingPoints).toBe(10);
  });

  it('should emit updated stats', () => {
    spyOn(component.statsAllocated, 'emit');
    const stat = component.allocatedStats[0];
    component.incrementStat(stat);
    
    expect(component.statsAllocated.emit).toHaveBeenCalledWith({
      'Force': 1,
      'Dextérité': 0
    });
  });
}); 