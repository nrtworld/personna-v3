import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CharacterTrait } from '../../../../models/data.model';

@Component({
  selector: 'app-traits-form',
  templateUrl: './traits-form.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TraitsFormComponent {
  @Input() traits: CharacterTrait[] = [];
  @Output() traitsSelected = new EventEmitter<CharacterTrait[]>();

  selectedTraits: CharacterTrait[] = [];
  searchTerm = '';
  maxTraits = 3;

  get filteredTraits(): CharacterTrait[] {
    return this.traits.filter(trait => 
      trait.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      trait.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get canAddTrait(): boolean {
    return this.selectedTraits.length < this.maxTraits;
  }

  isTraitSelected(trait: CharacterTrait): boolean {
    return this.selectedTraits.some(t => t.id === trait.id);
  }

  toggleTrait(trait: CharacterTrait) {
    if (this.isTraitSelected(trait)) {
      this.selectedTraits = this.selectedTraits.filter(t => t.id !== trait.id);
    } else if (this.canAddTrait) {
      this.selectedTraits = [...this.selectedTraits, trait];
    }
    this.traitsSelected.emit(this.selectedTraits);
  }

  removeTrait(trait: CharacterTrait) {
    this.selectedTraits = this.selectedTraits.filter(t => t.id !== trait.id);
    this.traitsSelected.emit(this.selectedTraits);
  }
} 