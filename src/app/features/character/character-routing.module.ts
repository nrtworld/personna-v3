import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CharacterCreationComponent } from './create/character-creation/character-creation.component';

const routes: Routes = [
  {
    path: 'create',
    component: CharacterCreationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CharacterRoutingModule { } 