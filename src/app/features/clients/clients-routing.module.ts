import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientsComponent } from './clients.component';
import { ClientFormComponent } from './components/client-form/client-form.component';
import { ClientListComponent } from './components/client-list/client-list.component';

const routes: Routes = [
  { path: 'all', component: ClientsComponent },
    { path: 'clientlist', component: ClientListComponent },
  { path: 'clientform', component: ClientFormComponent },
  // { path: ':id/edit', component: ClientFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientsRoutingModule { }
