import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseStatistic } from '../../../../models/data.model';

interface StatWithDetails {
  name: string;
  description: string;
  points: number;
}

const DEFAULT_STATS = [
  {
    name: 'Force',
    description: 'Représente la puissance physique du personnage',
  },
  {
    name: 'Dextérité',
    description: 'Représente l\'agilité et la précision du personnage',
  },
  {
    name: 'Constitution',
    description: 'Représente l\'endurance et la résistance du personnage',
  },
  {
    name: 'Intelligence',
    description: 'Représente les capacités mentales et le savoir du personnage',
  },
  {
    name: 'Sagesse',
    description: 'Représente l\'intuition et la perception du personnage',
  },
  {
    name: 'Charisme',
    description: 'Représente la force de personnalité et le leadership',
  }
];

@Component({
  selector: 'app-stats-form',
  templateUrl: './stats-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class StatsFormComponent implements OnInit {
  @Input() stats: Record<string, number> = {};
  @Input() availableStats: Array<{name: string, description: string}> = [];
  @Output() statsAllocated = new EventEmitter<Record<string, number>>();

  remainingPoints = 20;
  maxPointsPerStat = 5;
  allocatedStats: StatWithDetails[] = [];
  showAddStatModal = false;
  selectedStatToAdd: {name: string, description: string} | null = null;

  ngOnInit() {
    // Utilise les stats par défaut si aucune n'est disponible
    if (this.availableStats.length === 0) {
      this.availableStats = DEFAULT_STATS;
    }

    // Convert existing stats to full details format
    this.allocatedStats = Object.entries(this.stats).map(([name, value]) => {
      const statDetails = this.availableStats.find(s => s.name === name);
      return {
        name,
        description: statDetails?.description || '',
        points: value
      };
    });
  }

  addStat(stat: {name: string, description: string}) {
    if (!this.allocatedStats.some(s => s.name === stat.name)) {
      this.allocatedStats.push({
        name: stat.name,
        description: stat.description,
        points: 0
      });
      this.emitStats();
    }
  }

  removeStat(statToRemove: StatWithDetails) {
    this.remainingPoints += statToRemove.points;
    this.allocatedStats = this.allocatedStats.filter(
      stat => stat.name !== statToRemove.name
    );
    this.emitStats();
  }

  incrementStat(stat: StatWithDetails) {
    if (this.remainingPoints > 0 && stat.points < this.maxPointsPerStat) {
      stat.points++;
      this.remainingPoints--;
      this.emitStats();
    }
  }

  decrementStat(stat: StatWithDetails) {
    if (stat.points > 0) {
      stat.points--;
      this.remainingPoints++;
      this.emitStats();
    }
  }

  getAvailableNewStats() {
    return this.availableStats.filter(
      stat => !this.allocatedStats.some(s => s.name === stat.name)
    );
  }

  addSelectedStat() {
    if (this.selectedStatToAdd) {
      this.addStat(this.selectedStatToAdd);
      this.selectedStatToAdd = null;
    }
  }

  private emitStats() {
    const stats = this.allocatedStats.reduce((acc, stat) => ({
      ...acc,
      [stat.name]: stat.points
    }), {});
    this.statsAllocated.emit(stats);
  }
} 