import { Component, OnInit } from '@angular/core';
import { Character } from '../../models/database.model';
import { CharacterService } from '../../core/services/character.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
  characters$: Observable<Character[]> = new BehaviorSubject<Character[]>([]);
  searchTerm: string = '';
  selectedGame: string = '';
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor(private characterService: CharacterService) {}

  ngOnInit() {
    this.characters$ = this.characterService.getUserCharacters();
  }

  filterCharacters() {
    this.characters$ = this.characterService.getUserCharacters().pipe(
      map(characters => {
        return characters
          .filter(char => {
            const matchesSearch = char.name.toLowerCase().includes(this.searchTerm.toLowerCase());
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

  deleteCharacter(characterId: string) {
    this.characterService.deleteCharacter(characterId);
  }
} 