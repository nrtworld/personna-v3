import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventoryFormComponent } from './inventory-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InventoryItem, Dice } from '../../../../models/inventory.model';

describe('InventoryFormComponent', () => {
  let component: InventoryFormComponent;
  let fixture: ComponentFixture<InventoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryFormComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(InventoryFormComponent);
    component = fixture.componentInstance;
    component.inventory = {
      items: [],
      dices: [],
      currentWeight: 0
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Item Management', () => {
    it('should add new item', () => {
      const newItem = {
        name: 'Sword',
        description: 'Sharp blade',
        quantity: 1,
        weight: 2,
        type: 'weapon'
      };

      component.itemForm.patchValue(newItem);
      component.addItem();

      expect(component.inventory.items.length).toBe(1);

    });

    it('should edit existing item', () => {
      const item: InventoryItem = {
        id: '123',
        name: 'Sword',
        quantity: 1,
        weight: 2
      };
      component.inventory.items = [item];

      const updatedItem = { ...item, name: 'Long Sword' };
      component.editItem(item);
      component.itemForm.patchValue(updatedItem);
      component.addItem();

      expect(component.inventory.items[0].name).toBe('Long Sword');
    });

    it('should remove item', () => {
      const item: InventoryItem = {
        id: '123',
        name: 'Sword',
        quantity: 1,
        weight: 2
      };
      component.inventory.items = [item];

      component.removeItem(item);

      expect(component.inventory.items.length).toBe(0);
    });

    it('should calculate total weight', () => {
      const items: InventoryItem[] = [
        { id: '1', name: 'Sword', quantity: 1, weight: 2 },
        { id: '2', name: 'Shield', quantity: 1, weight: 3 }
      ];
      component.inventory.items = items;

      // Trigger weight calculation through addItem
      component.itemForm.patchValue(items[0]);
      component.addItem();

      expect(component.inventory.currentWeight).toBe(5);
    });
  });

  describe('Dice Management', () => {
    it('should add new dice', () => {
      const newDice = {
        name: 'D20',
        faces: 20,
        quantity: 1,
        modifier: 0
      };

      component.diceForm.patchValue(newDice);
      component.addDice();

      expect(component.inventory.dices.length).toBe(1);
      expect(component.inventory.dices[0].faces).toBe(20);
    });

    it('should edit existing dice', () => {
      const dice: Dice = {
        id: '123',
        name: 'D6',
        faces: 6,
        quantity: 1
      };
      component.inventory.dices = [dice];

      const updatedDice = { ...dice, quantity: 2 };
      component.editDice(dice);
      component.diceForm.patchValue(updatedDice);
      component.addDice();

      expect(component.inventory.dices[0].quantity).toBe(2);
    });

    it('should remove dice', () => {
      const dice: Dice = {
        id: '123',
        name: 'D6',
        faces: 6,
        quantity: 1
      };
      component.inventory.dices = [dice];

      component.removeDice(dice);

      expect(component.inventory.dices.length).toBe(0);
    });
  });

  describe('Form Validation', () => {
    it('should not add item with invalid form', () => {
      component.itemForm.patchValue({
        name: '', // Required field is empty
        quantity: 1,
        weight: 0,
        type: 'weapon'
      });

      component.addItem();

      expect(component.inventory.items.length).toBe(0);
    });

    it('should not add dice with invalid form', () => {
      component.diceForm.patchValue({
        name: '', // Required field is empty
        faces: 6,
        quantity: 1,
        modifier: 0
      });

      component.addDice();

      expect(component.inventory.dices.length).toBe(0);
    });
  });

  describe('Item Types', () => {
    it('should return correct item type label', () => {
      expect(component.getItemTypeLabel('weapon')).toBe('Arme');
      expect(component.getItemTypeLabel('armor')).toBe('Armure');
      expect(component.getItemTypeLabel('equipment')).toBe('Équipement');
      expect(component.getItemTypeLabel('unknown')).toBe('unknown');
    });
  });
});
