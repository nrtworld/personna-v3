import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Character } from '../../../models/database.model';
import { CharacterService } from '../services/character.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { InventoryFormComponent } from './inventory-form/inventory-form.component';
import { InventoryItem } from '../../../models/inventory.model';
import { getAuth } from 'firebase/auth';
import { IdentityFormComponent } from './identity-form/identity-form.component';

@Component({
  selector: 'app-character-create',
  template: `
    <div class="character-creation">
      <!-- Onglets de navigation -->
      <div class="tabs">
        <button [class.active]="currentTab === 1" (click)="currentTab = 1">1/7 - Identité</button>
        <button [class.active]="currentTab === 2" (click)="currentTab = 2">2/7 - Inventaire</button>
        <!-- autres onglets... -->
      </div>

      <!-- Ajout du formulaire d'identité -->
      <div *ngIf="currentTab === 1">
        <app-identity-form
          [name]="character.name"
          [age]="character.age"
          [maxHp]="character.maxHp"
          [currentHp]="character.currentHp"
          (save)="onIdentitySave($event)">
        </app-identity-form>
        
        <div class="actions">
          <button (click)="nextTab()">Suivant</button>
        </div>
      </div>

      <div *ngIf="currentTab === 2">
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
  imports: [CommonModule, InventoryFormComponent, IdentityFormComponent]
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
    age: undefined,
    maxHp: 0,
    currentHp: 0,
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
    console.log('Tentative de sauvegarde du personnage');
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      this.snackBar.open('Veuillez vous connecter pour sauvegarder le personnage', 'Fermer', {
        duration: 5000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      return;
    }

    this.characterService.saveCharacter(this.character).subscribe({
      next: () => {
        this.snackBar.open('Personnage sauvegardé avec succès', 'Fermer', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
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

  onIdentitySave(identityData: any): void {
    this.character = {
      ...this.character,
      ...identityData
    };
    this.saveCharacter();
  }
} 