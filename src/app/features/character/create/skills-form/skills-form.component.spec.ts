import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkillsFormComponent } from './skills-form.component';
import { Skill } from '../../../../models/database.model';

describe('SkillsFormComponent', () => {
  let component: SkillsFormComponent;
  let fixture: ComponentFixture<SkillsFormComponent>;

  const mockSkills: Skill[] = [
    { 
      name: 'Escalade', 
      description: 'Capacité à grimper', 
      relatedStats: ['Force', 'Dextérité'] 
    },
    { 
      name: 'Discrétion', 
      description: 'Capacité à se cacher', 
      relatedStats: ['Dextérité', 'Furtivité'] 
    }
  ];

  const mockStats = {
    'Force': 2,
    'Dextérité': 1
  };

  const mockMasteries = {
    'Furtivité': 2
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillsFormComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsFormComponent);
    component = fixture.componentInstance;
    component.skills = mockSkills;
    component.stats = mockStats;
    component.masteries = mockMasteries;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate correct bonus', () => {
    expect(component.allocatedSkills[0].totalBonus).toBe(3); // Force(2) + Dextérité(1)
    expect(component.allocatedSkills[1].totalBonus).toBe(3); // Dextérité(1) + Furtivité(2)
  });

  it('should increment skill points', () => {
    const skill = component.allocatedSkills[0];
    component.incrementSkill(skill);
    expect(skill.points).toBe(1);
    expect(component.remainingPoints).toBe(9);
  });

  it('should calculate total value correctly', () => {
    const skill = component.allocatedSkills[0];
    component.incrementSkill(skill);
    expect(component.getTotalValue(skill)).toBe(4); // points(1) + bonus(3)
  });

  it('should emit updated skills', () => {
    spyOn(component.skillsAllocated, 'emit');
    const skill = component.allocatedSkills[0];
    component.incrementSkill(skill);
    
    expect(component.skillsAllocated.emit).toHaveBeenCalledWith({
      'Escalade': 1,
      'Discrétion': 0
    });
  });
}); 