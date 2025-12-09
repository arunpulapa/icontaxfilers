import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/teams/features/dashboard/dashboard.component';
import { ClientsComponent } from '../features/clients/clients.component';
import { MyclientsComponent } from '../features/myclients/myclients.component';
import { TaskmanagmentComponent } from '../features/taskmanagment/taskmanagment.component';
import { ProfileComponent } from '../features/profile/profile.component';
import { SettingsComponent } from '../features/settings/settings.component';
import { TeamDocumentsUploadComponent } from '../features/team-documents-upload/team-documents-upload.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },   // /client → /client/dashboard
  { path: 'dashboard', component: DashboardComponent },       // /client/dashboard
  { path: 'clients', component: ClientsComponent },
  { path: 'documents', component: TeamDocumentsUploadComponent },
  { path: 'myclients', component: MyclientsComponent },
  { path: 'taskmangment', component: TaskmanagmentComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'settings', component: SettingsComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeamsRoutingModule { }
