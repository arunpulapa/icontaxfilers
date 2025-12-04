import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsComponent } from './clients.component';
import { ClientFormComponent } from './components/client-form/client-form.component';
import { ClientListComponent } from './components/client-list/client-list.component';
import { SearchclientComponent } from './components/searchclient/searchclient.component';

const routes: Routes = [
  { path: 'all', component: ClientsComponent },
  { path: 'clientlist', component: ClientListComponent },
  { path: 'clientform', component: ClientFormComponent },
  { path: 'searchclient', component: SearchclientComponent },
  // { path: ':id/edit', component: ClientFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
