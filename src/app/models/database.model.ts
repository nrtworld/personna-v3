export interface User {
  uid: string;
  email: string;
  characters?: string[]; // IDs des personnages
}

export interface Character {
  id?: string;
  userId: string;
  game: string;
  name: string;
  photo?: string;
  xp: number;
  // autres propriétés selon le jeu...
}

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