import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadsRoutingModule } from './leads-routing.module';
import { LeadsComponent } from './leads.component';
import { LeadListComponent } from './components/lead-list/lead-list.component';
import { LeadFormComponent } from './components/lead-form/lead-form.component';


@NgModule({
  declarations: [
    LeadsComponent,
    LeadListComponent,
    LeadFormComponent
  ],
  imports: [
    CommonModule,
    LeadsRoutingModule
  ]
})
export class LeadsModule { }
