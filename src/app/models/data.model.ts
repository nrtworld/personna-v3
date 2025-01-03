export interface Character {
  id?: string;
  name: string;
  age?: number;
  photo?: string;
  maxHp: number;
  currentHp: number;
}

export interface BaseStatistic {
  value: number;
  modifier?: number;
}

export interface CharacterTrait {
  id: string;
  name: string;
  description: string;
} 