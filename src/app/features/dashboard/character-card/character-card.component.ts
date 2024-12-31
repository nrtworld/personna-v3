import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Character } from '../../../models/database.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class CharacterCardComponent {
  @Input() character!: Character;
  @Output() deleteCharacter = new EventEmitter<string>();

  confirmDelete() {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce personnage ?')) {
      this.deleteCharacter.emit(this.character.id);
    }
  }
} 