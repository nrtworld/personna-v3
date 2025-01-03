export interface User {
  uid: string;
  email: string;
  characters?: string[]; // IDs des personnages
}

export interface BaseCharacter {
  userId: string;
  game: string;
  name: string;
  photo?: string;
  xp: number;
}

export interface Character {
  id: string;
  userId: string;
  game: string;
  name: string;
  photo?: string;
  age?: number;
  xp: number;
  maxHp: number;
  currentHp: number;
  stats: Record<string, BaseStatistic>;
  masteries: Mastery[];
  skills: Skill[];
  traits: CharacterTrait[];
  inventory: InventoryState;
  notes: Note[];
}

export type NewCharacter = Omit<Character, 'id'>;

export interface GameReference {
  id: string;
  name: string;
  stats: BaseStatistic[];
  masteries: Mastery[];
  skills: Skill[];
  traits: CharacterTrait[];
}

export interface BaseStatistic {
  name: string;
  description: string;
}

export interface Mastery {
  name: string;
  description: string;
}

export interface Skill {
  name: string;
  description: string;
  relatedStats: string[]; // noms des stats/maîtrises liées
}

export interface CharacterTrait {
  name: string;
  description: string;
}

export interface InventoryState {
  items: any[];
  dices: any[];
  currentWeight: number;
}

export interface Note {
  title?: string;
  content: string;
} 