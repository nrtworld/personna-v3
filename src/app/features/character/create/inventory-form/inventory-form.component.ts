import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InventoryItem, Dice } from '../../../../models/inventory.model';

@Component({
  selector: 'app-inventory-form',
  templateUrl: './inventory-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class InventoryFormComponent {
  @Input() inventory!: {
    items: InventoryItem[];
    dices: Dice[];
    currentWeight: number;
    maxWeight?: number;
  };

  getItemTypeLabel(type: string): string {
    // Implémentation de la méthode
    return type; // À adapter selon vos besoins
  }
} 