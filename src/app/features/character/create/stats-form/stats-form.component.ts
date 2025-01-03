import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseStatistic } from '../../../../models/data.model';

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
  @Output() statsAllocated = new EventEmitter<Record<string, number>>();

  remainingPoints = 20;
  maxPointsPerStat = 5;
  allocatedStats: Array<{name: string, points: number}> = [];

  ngOnInit() {
    this.allocatedStats = Object.entries(this.stats).map(([name, value]) => ({
      name,
      points: value
    }));
  }

  incrementStat(stat: {name: string, points: number}) {
    if (this.remainingPoints > 0 && stat.points < this.maxPointsPerStat) {
      stat.points++;
      this.remainingPoints--;
      this.emitStats();
    }
  }

  decrementStat(stat: {name: string, points: number}) {
    if (stat.points > 0) {
      stat.points--;
      this.remainingPoints++;
      this.emitStats();
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