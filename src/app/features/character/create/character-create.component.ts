import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Character } from '../../../models/database.model';
import { CharacterService } from '../services/character.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { InventoryFormComponent } from './inventory-form/inventory-form.component';

@Component({
  selector: 'app-character-create',
  template: `
    <div class="character-creation">
      <!-- Onglets de navigation -->
      <div class="tabs">
        <button [class.active]="currentTab === 1" (click)="currentTab = 1">1/7 - Inventaire</button>
        <!-- autres onglets... -->
      </div>

      <!-- Contenu de l'onglet Inventaire -->
      <div *ngIf="currentTab === 1">
        <app-inventory-form
          [inventory]="character.inventory"
          (inventoryChange)="onInventoryChange($event)">
        </app-inventory-form>
        
        <div class="actions">
          <button (click)="saveCharacter()">Sauvegarder</button>
          <button (click)="nextTab()">Suivant</button>
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, InventoryFormComponent]
})
export class CharacterCreateComponent {
  currentTab = 1;
  character: Partial<Character> = {
    inventory: {
      items: [],
      dices: [],
      currentWeight: 0,
      maxWeight: 50
    },
    name: '',
    stats: {},
    masteries: [],
    skills: [],
    traits: [],
    notes: []
  };

  constructor(
    private characterService: CharacterService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  onInventoryChange(newInventory: Character['inventory']): void {
    this.character.inventory = newInventory;
    // Calculer le poids total si nécessaire
    this.character.inventory.currentWeight = this.calculateTotalWeight(newInventory.items);
  }

  private calculateTotalWeight(items: InventoryItem[]): number {
    return items.reduce((total, item) => total + (item.weight * item.quantity), 0);
  }

  saveCharacter(): void {
    this.characterService.saveCharacter(this.character).subscribe({
      next: () => {
        this.snackBar.open('Personnage sauvegardé avec succès', 'Fermer', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        // Rediriger vers la liste des personnages après la sauvegarde
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Erreur lors de la sauvegarde:', error);
        this.snackBar.open(
          'Erreur lors de la sauvegarde du personnage',
          'Fermer',
          {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

  nextTab(): void {
    if (this.currentTab < 7) {
      this.currentTab++;
    }
  }
} 