import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterCreationComponent } from './character-creation/character-creation.component';
import { StatsFormComponent } from './stats-form/stats-form.component';
// ... other imports

@NgModule({
  declarations: [
    CharacterCreationComponent,
    StatsFormComponent,
    // ... other components
  ],
  imports: [
    CommonModule,
    // ... other modules
  ]
})
export class CharacterCreateModule { } 