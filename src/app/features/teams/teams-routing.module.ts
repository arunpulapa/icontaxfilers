import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeamsComponent } from './teams.component';
import { TeamListComponent } from './components/team-list/team-list.component';
import { TeamFormComponent } from './components/team-form/team-form.component';

const routes: Routes = [
  { path: '', component: TeamsComponent },
  { path: 'new', component: TeamFormComponent },
  { path: ':id/edit', component: TeamFormComponent },
  { path: ':id/members', component: TeamsComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamsRoutingModule { }
