import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IdentityFormComponent } from './identity-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CharacterService } from '../../../../core/services/character.service';
import { of } from 'rxjs';

describe('IdentityFormComponent', () => {
  let component: IdentityFormComponent;
  let fixture: ComponentFixture<IdentityFormComponent>;
  let characterService: jasmine.SpyObj<CharacterService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CharacterService', ['addCharacter']);
    spy.addCharacter.and.returnValue(Promise.resolve('new-id'));

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [IdentityFormComponent],
      providers: [
        { provide: CharacterService, useValue: spy }
      ]
    }).compileComponents();

    characterService = TestBed.inject(CharacterService) as jasmine.SpyObj<CharacterService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.form.get('name')?.value).toBe('');
    expect(component.form.get('age')?.value).toBe('');
    expect(component.form.get('maxHp')?.value).toBe('');
    expect(component.form.get('currentHp')?.value).toBe('');
  });

  it('should validate required fields', () => {
    expect(component.form.valid).toBeFalsy();
    
    component.form.patchValue({
      name: 'Aragorn',
      age: 87,
      maxHp: 100,
      currentHp: 100
    });

    expect(component.form.valid).toBeTruthy();
  });

  it('should validate HP values', () => {
    component.form.patchValue({
      name: 'Aragorn',
      age: 87,
      maxHp: 50,
      currentHp: 100
    });

    expect(component.form.get('currentHp')?.errors?.['maxExceeded']).toBeTruthy();
  });

  it('should emit form value when valid', () => {
    spyOn(component.save, 'emit');
    
    component.form.patchValue({
      name: 'Aragorn',
      age: 87,
      maxHp: 100,
      currentHp: 100
    });

    component.onSubmit();

    expect(component.save.emit).toHaveBeenCalledWith({
      name: 'Aragorn',
      age: 87,
      maxHp: 100,
      currentHp: 100
    });
  });
}); 