import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KeyValuePipe } from '@angular/common';
import { Mastery } from '../../../../models/character-creation.model';

@Component({
  selector: 'app-masteries-form',
  templateUrl: './masteries-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    KeyValuePipe
  ]
})
export class MasteriesFormComponent {
  protected readonly Math = Math;

  @Input() masteries!: Record<string, number>;
  @Output() masteriesAllocated = new EventEmitter<Record<string, number>>();

  remainingPoints = 15;
  maxPointsPerMastery = 5;

  updateMastery(name: string, value: number) {
    const newMasteries = { ...this.masteries, [name]: value };
    this.masteriesAllocated.emit(newMasteries);
  }
} 