export interface GameReferential {
  id: string;
  name: string;
  description?: string;
  stats: StatDefinition[];
  masteries: MasteryDefinition[];
  skills: SkillDefinition[];
  traits: TraitDefinition[];
  itemTypes: ItemTypeDefinition[];
}

export interface StatDefinition {
  id: string;
  name: string;
  description: string;
  minValue: number;
  maxValue: number;
  defaultValue: number;
}

export interface MasteryDefinition {
  id: string;
  name: string;
  description: string;
  relatedStats: string[]; // IDs des stats liées
}

export interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  relatedStats: string[]; // IDs des stats liées
  relatedMasteries: string[]; // IDs des maîtrises liées
}

export interface TraitDefinition {
  id: string;
  name: string;
  description: string;
  category?: string;
  effects?: TraitEffect[];
}

export interface TraitEffect {
  type: 'bonus' | 'malus' | 'special';
  target: string; // ID de la stat, maîtrise ou compétence affectée
  value: number | string;
  condition?: string;
}

export interface ItemTypeDefinition {
  id: string;
  name: string;
  description: string;
  properties: string[]; // Propriétés spécifiques au type (ex: ['damage', 'weight'])
} 