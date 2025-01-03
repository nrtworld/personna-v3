import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CharacterService } from '../../../../core/services/character.service';
import { CharacterCreationState, ValidationState, ValidationErrors, Mastery, Skill, CharacterNote } from '../../../../models/character-creation.model';
import { IdentityFormComponent } from '../identity-form/identity-form.component';
import { StatsFormComponent } from '../stats-form/stats-form.component';
import { MasteriesFormComponent } from '../masteries-form/masteries-form.component';
import { SkillsFormComponent } from '../skills-form/skills-form.component';
import { TraitsFormComponent } from '../traits-form/traits-form.component';
import { InventoryFormComponent } from '../inventory-form/inventory-form.component';
import { NotesFormComponent } from '../notes-form/notes-form.component';
import { BaseStatistic } from '../../../../models/data.model';

interface MasteryEntry {
  key: string;
  value: number;
}

@Component({
  selector: 'app-character-creation',
  templateUrl: './character-creation.component.html',
  styleUrls: ['./character-creation.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IdentityFormComponent,
    StatsFormComponent,
    MasteriesFormComponent,
    SkillsFormComponent,
    TraitsFormComponent,
    InventoryFormComponent,
    NotesFormComponent
  ]
})
export class CharacterCreationComponent implements OnInit {
  currentStep = 1;
  totalSteps = 7;

  characterState: CharacterCreationState = {
    name: '',
    maxHp: 0,
    currentHp: 0,
    stats: {},
    masteries: {},
    skills: [] as Skill[],
    traits: [],
    inventory: {
      items: [],
      dices: [],
      currentWeight: 0,
      maxWeight: 100
    },
    notes: [] as CharacterNote[]
  };

  validationState: ValidationState = {
    identity: false,
    stats: false,
    masteries: false,
    skills: false,
    traits: false,
    inventory: false,
    notes: false
  };

  validationErrors: ValidationErrors = {};

  constructor(
    private characterService: CharacterService,
    private router: Router
  ) {}

  ngOnInit() {
    // Charger les données de référence si nécessaire
  }

  onIdentitySubmit(identityData: any) {
    this.characterState = { ...this.characterState, ...identityData };
    this.validateIdentity();
  }

  onStatsSubmit(stats: Record<string, number>) {
    this.characterState.stats = Object.entries(stats).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: { value }
    }), {});
    this.validateStats();
  }

  onMasteriesSubmit(masteries: Record<string, number>) {
    this.characterState.masteries = masteries;
    this.validateMasteries();
  }

  onSkillsSubmit(skills: Record<string, number>) {
    this.characterState.skills = Object.entries(skills).map(([name, level]) => ({
      id: crypto.randomUUID(),
      name,
      level,
      description: '',
      relatedStats: []
    }));
    this.validateSkills();
  }

  onTraitsSubmit(traits: any[]) {
    this.characterState.traits = traits;
    this.validateTraits();
  }

  onInventorySubmit(inventory: any) {
    this.characterState.inventory = inventory;
    this.validateInventory();
  }

  onNotesSubmit(notes: Partial<CharacterNote>[]) {
    this.characterState.notes = notes.map(note => ({
      id: note.id || crypto.randomUUID(),
      title: note.title || '',
      content: note.content || '',
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    this.validateNotes();
  }

  private validateIdentity(): boolean {
    const errors: string[] = [];
    if (!this.characterState.name) {
      errors.push('Le nom est requis');
    }
    if (this.characterState.maxHp <= 0) {
      errors.push('Les points de vie maximum doivent être supérieurs à 0');
    }
    if (this.characterState.currentHp > this.characterState.maxHp) {
      errors.push('Les points de vie actuels ne peuvent pas dépasser le maximum');
    }

    this.validationErrors.identity = errors;
    this.validationState.identity = errors.length === 0;
    return this.validationState.identity;
  }

  private validateStats(): boolean {
    const errors: string[] = [];
    const totalPoints = Object.values(this.characterState.stats).reduce((a, b) => a + b.value, 0);
    if (totalPoints > 20) {
      errors.push('Le total des points de statistiques ne peut pas dépasser 20');
    }

    this.validationErrors.stats = errors;
    this.validationState.stats = errors.length === 0;
    return this.validationState.stats;
  }

  private validateMasteries(): boolean {
    const errors: string[] = [];
    const totalPoints = this.calculateTotal(this.characterState.masteries);
    if (totalPoints > 15) {
      errors.push('Le total des points de maîtrise ne peut pas dépasser 15');
    }
    this.validationErrors.masteries = errors;
    this.validationState.masteries = errors.length === 0;
    return this.validationState.masteries;
  }

  private calculateTotal(entries: Record<string, number>): number {
    return Object.values(entries)
      .reduce((sum: number, value: number) => sum + value, 0);
  }

  private convertToRecord(entries: MasteryEntry[]): Record<string, number> {
    return entries.reduce((acc: Record<string, number>, entry: MasteryEntry) => ({
      ...acc,
      [entry.key]: entry.value
    }), {});
  }

  private validateSkills(): boolean {
    const errors: string[] = [];
    const totalPoints = this.characterState.skills.reduce((sum, skill) => sum + skill.level, 0);
    if (totalPoints > 10) {
      errors.push('Le total des points de compétences ne peut pas dépasser 10');
    }
    this.validationErrors.skills = errors;
    this.validationState.skills = errors.length === 0;
    return this.validationState.skills;
  }

  private validateTraits(): boolean {
    const errors: string[] = [];
    if (this.characterState.traits.length > 3) {
      errors.push('Le nombre de traits ne peut pas dépasser 3');
    }

    this.validationErrors.traits = errors;
    this.validationState.traits = errors.length === 0;
    return this.validationState.traits;
  }

  private validateInventory(): boolean {
    const errors: string[] = [];
    if (this.characterState.inventory.maxWeight && 
        this.characterState.inventory.currentWeight > this.characterState.inventory.maxWeight) {
      errors.push('Le poids total dépasse la capacité de transport');
    }

    this.validationErrors.inventory = errors;
    this.validationState.inventory = errors.length === 0;
    return this.validationState.inventory;
  }

  private validateNotes(): boolean {
    this.validationState.notes = true;
    return true;
  }

  canProceed(): boolean {
    switch (this.currentStep) {
      case 1: return this.validationState.identity;
      case 2: return this.validationState.stats;
      case 3: return this.validationState.masteries;
      case 4: return this.validationState.skills;
      case 5: return this.validationState.traits;
      case 6: return this.validationState.inventory;
      case 7: return this.validationState.notes;
      default: return false;
    }
  }

  nextStep() {
    if (this.canProceed() && this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  async saveCharacter() {
    if (this.isValid()) {
      try {
        await this.characterService.addCharacter(this.characterState);
        this.router.navigate(['/dashboard']);
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
      }
    }
  }

  public isValid(): boolean {
    return Object.values(this.validationState).every(state => state);
  }

  getCurrentErrors(): string[] {
    switch (this.currentStep) {
      case 1: return this.validationErrors.identity || [];
      case 2: return this.validationErrors.stats || [];
      case 3: return this.validationErrors.masteries || [];
      case 4: return this.validationErrors.skills || [];
      case 5: return this.validationErrors.traits || [];
      case 6: return this.validationErrors.inventory || [];
      case 7: return this.validationErrors.notes || [];
      default: return [];
    }
  }

  getStatValue(stat: BaseStatistic): number {
    return stat.value + (stat.modifier || 0);
  }

  getStatValues(stats: Record<string, BaseStatistic>): Record<string, number> {
    const result: Record<string, number> = {};
    Object.entries(stats).forEach(([key, stat]) => {
      result[key] = this.getStatValue(stat);
    });
    return result;
  }

  getMasteriesAsRecord(): Record<string, number> {
    return this.characterState.masteries;
  }

  updateMasteries(masteries: Record<string, number>) {
    this.characterState.masteries = masteries;
  }

  get totalMasteryPoints(): number {
    return this.calculateTotal(this.characterState.masteries);
  }

  private convertMasteriesToRecord(): Record<string, number> {
    return this.convertToRecord(Object.entries(this.characterState.masteries)
      .map(([key, value]) => ({ key, value })));
  }

  updateNotes(notes: Partial<CharacterNote>[]) {
    this.characterState.notes = notes.map(note => ({
      id: note.id || crypto.randomUUID(),
      title: note.title || '',
      content: note.content || '',
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  }
} 