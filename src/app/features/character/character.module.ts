import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterRoutingModule } from './character-routing.module';
import { CharacterCreationComponent } from './create/character-creation/character-creation.component';
import { StatsFormComponent } from './create/stats-form/stats-form.component';
import { MasteriesFormComponent } from './create/masteries-form/masteries-form.component';
import { TraitsFormComponent } from './create/traits-form/traits-form.component';
import { InventoryFormComponent } from './create/inventory-form/inventory-form.component';

@NgModule({
  imports: [
    CommonModule,
    CharacterRoutingModule,
    // Les composants sont standalone, pas besoin de les déclarer
    CharacterCreationComponent,
    StatsFormComponent,
    MasteriesFormComponent,
    TraitsFormComponent,
    InventoryFormComponent
  ]
})
export class CharacterModule { } 