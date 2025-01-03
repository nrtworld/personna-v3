import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Observable, map } from 'rxjs';
import { CharacterService } from '../../core/services/character.service';
import { Character } from '../../models/database.model';
import { CharacterCardComponent } from './character-card/character-card.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    CharacterCardComponent
  ]
})
export class DashboardComponent implements OnInit {
  characters$: Observable<Character[]>;
  searchTerm: string = '';
  selectedGame: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(
    private characterService: CharacterService,
    private router: Router
  ) {
    this.characters$ = this.characterService.characters$;
  }

  ngOnInit(): void {
    this.filterCharacters();
  }

  filterCharacters(): void {
    this.characters$ = this.characterService.characters$.pipe(
      map(characters => {
        return characters
          .filter(char => {
            const matchesSearch = char.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                                char.game.toLowerCase().includes(this.searchTerm.toLowerCase());
            const matchesGame = !this.selectedGame || char.game === this.selectedGame;
            return matchesSearch && matchesGame;
          })
          .sort((a, b) => {
            return this.sortOrder === 'asc' 
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(a.name);
          });
      })
    );
  }

  onCharacterClick(character: Character): void {
    this.router.navigate(['/character', character.id]);
  }

  async onCharacterDelete(character: Character): Promise<void> {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${character.name} ?`)) {
      try {
        await this.characterService.deleteCharacter(character.id);
        // La mise à jour de la liste est automatique grâce à la synchronisation
      } catch (error) {
        console.error('Error deleting character:', error);
        // TODO: Ajouter un service de notification pour informer l'utilisateur
      }
    }
  }
} 