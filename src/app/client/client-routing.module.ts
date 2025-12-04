import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { DocumentsComponent } from './features/documents/documents.component';
import { ProfileComponent } from './features/profile/profile.component';
import { SettingsComponent } from '../features/settings/settings.component';

const routes: Routes = [
   { path: '', redirectTo: 'dashboard', pathMatch: 'full' },   // /client → /client/dashboard
  { path: 'dashboard', component: DashboardComponent },       // /client/dashboard
  { path: 'documents', component: DocumentsComponent },
  {path:'profile', component:ProfileComponent },
   {path:'settings', component:SettingsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
