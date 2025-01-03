import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-identity-form',
  templateUrl: './identity-form.component.html',
  styleUrls: ['./identity-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class IdentityFormComponent {
  @Input() name: string = '';
  @Input() age?: number;
  @Input() maxHp: number = 0;
  @Input() currentHp: number = 0;
  @Input() photo?: string;
  @Output() save = new EventEmitter<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      age: ['', [Validators.required, Validators.min(0)]],
      maxHp: ['', [Validators.required, Validators.min(1)]],
      currentHp: ['', [Validators.required, Validators.min(0)]],
    }, { validators: this.validateHp });
  }

  ngOnInit() {
    this.form.patchValue({
      name: this.name,
      age: this.age,
      maxHp: this.maxHp,
      currentHp: this.currentHp
    });
  }

  validateHp(group: FormGroup) {
    const maxHp = group.get('maxHp')?.value;
    const currentHp = group.get('currentHp')?.value;
    
    if (currentHp > maxHp) {
      group.get('currentHp')?.setErrors({ maxExceeded: true });
      return { maxExceeded: true };
    }
    return null;
  }

  onSubmit() {
    console.log('Form submitted:', {
      formValue: this.form.value,
      formValid: this.form.valid,
      formErrors: this.form.errors
    });
    
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }
} 