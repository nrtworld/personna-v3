import { Character, BaseStatistic, CharacterTrait } from '../models/data.model';
import { InventoryItem, Dice, Note } from './inventory.model';

export interface Mastery {
  id: string;
  name: string;
  description: string;
  level: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  relatedStats: string[];
  level: number;
}

export interface InventoryState {
  items: InventoryItem[];
  dices: Dice[];
  currentWeight: number;
  maxWeight: number;
}

export interface ValidationState {
  identity: boolean;
  stats: boolean;
  masteries: boolean;
  skills: boolean;
  traits: boolean;
  inventory: boolean;
  notes: boolean;
}

export interface ValidationErrors {
  identity?: string[];
  stats?: string[];
  masteries?: string[];
  skills?: string[];
  traits?: string[];
  inventory?: string[];
  notes?: string[];
}

export interface CharacterNote {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface CharacterCreationState {
  name: string;
  age?: number;
  photo?: string;
  maxHp: number;
  currentHp: number;
  stats: Record<string, BaseStatistic>;
  masteries: Record<string, number>;
  skills: Skill[];
  traits: CharacterTrait[];
  inventory: InventoryState;
  notes: CharacterNote[];
} 