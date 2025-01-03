import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Skill, BaseStatistic, Mastery } from '../../../../models/database.model';

interface SkillWithPoints {
  skill: Skill;
  points: number;
  totalBonus: number;
}

@Component({
  selector: 'app-skills-form',
  templateUrl: './skills-form.component.html',
  styleUrls: ['./skills-form.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SkillsFormComponent implements OnInit {
  @Input() availablePoints = 10;
  @Input() maxPointsPerSkill = 3;
  @Input() skills: Skill[] = [];
  @Input() stats: Record<string, number> = {};
  @Input() masteries: Record<string, number> = {};
  @Output() skillsAllocated = new EventEmitter<Record<string, number>>();

  allocatedSkills: SkillWithPoints[] = [];
  remainingPoints = 0;

  ngOnInit() {
    this.remainingPoints = this.availablePoints;
    this.allocatedSkills = this.skills.map(skill => ({
      skill,
      points: 0,
      totalBonus: this.calculateBonus(skill)
    }));
  }

  private calculateBonus(skill: Skill): number {
    return skill.relatedStats.reduce((total, statName) => {
      const statBonus = this.stats[statName] || 0;
      const masteryBonus = this.masteries[statName] || 0;
      return total + statBonus + masteryBonus;
    }, 0);
  }

  incrementSkill(skillWithPoints: SkillWithPoints) {
    if (this.remainingPoints > 0 && skillWithPoints.points < this.maxPointsPerSkill) {
      skillWithPoints.points++;
      this.remainingPoints--;
      this.emitSkills();
    }
  }

  decrementSkill(skillWithPoints: SkillWithPoints) {
    if (skillWithPoints.points > 0) {
      skillWithPoints.points--;
      this.remainingPoints++;
      this.emitSkills();
    }
  }

  getTotalValue(skillWithPoints: SkillWithPoints): number {
    return skillWithPoints.points + skillWithPoints.totalBonus;
  }

  private emitSkills() {
    const skills = this.allocatedSkills.reduce((acc, { skill, points }) => ({
      ...acc,
      [skill.name]: points
    }), {});
    this.skillsAllocated.emit(skills);
  }
} 