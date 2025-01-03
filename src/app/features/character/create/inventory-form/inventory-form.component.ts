import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
export class InventoryFormComponent implements OnInit {
  @Input() inventory!: {
    items: InventoryItem[];
    dices: Dice[];
    currentWeight: number;
    maxWeight?: number;
  };

  itemForm: FormGroup;
  diceForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      quantity: [1, Validators.required],
      weight: [0, Validators.required],
      type: ['']
    });

    this.diceForm = this.fb.group({
      name: ['', Validators.required],
      faces: [6, Validators.required],
      quantity: [1, Validators.required],
      modifier: [0]
    });
  }

  ngOnInit(): void {}

  getItemTypeLabel(type: string): string {
    // Implémentation de la méthode
    return type; // À adapter selon vos besoins
  }

  addItem(): void {
    // Logic to add item to inventory
  }

  editItem(item: InventoryItem): void {
    // Logic to edit item in inventory
  }

  removeItem(item: InventoryItem): void {
    // Logic to remove item from inventory
  }

  addDice(): void {
    if (this.diceForm.valid) {
      const dice: Dice = {
        id: crypto.randomUUID(),
        ...this.diceForm.value
      };
      this.inventory.dices.push(dice);
      this.diceForm.reset({
        faces: 6,
        quantity: 1,
        modifier: 0
      });
    }
  }

  editDice(dice: Dice): void {
    // Logic to edit dice
  }

  removeDice(dice: Dice): void {
    // Logic to remove dice
  }
} 