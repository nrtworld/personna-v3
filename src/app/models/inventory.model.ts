export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  weight: number;
  description?: string;
  type?: string;
}

export interface Dice {
  id: string;
  name: string;
  quantity: number;
  faces: number;
  modifier?: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
} 