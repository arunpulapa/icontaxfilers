import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { TeamKraComponent } from './components/team-kra/team-kra.component';
import { DashboardClientsComponent } from './components/dashboard-clients/dashboard-clients.component';
import { DashboardLeadsComponent } from './components/dashboard-leads/dashboard-leads.component';
import { DashboardReferralsComponent } from './components/dashboard-referrals/dashboard-referrals.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    DashboardComponent,
    TeamKraComponent,
    DashboardClientsComponent,
    DashboardLeadsComponent,
    DashboardReferralsComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MatCardModule,
    MatIconModule,
    MatGridListModule,
    MatButtonModule,
    MatTableModule,
    MatTabsModule,
    MatProgressBarModule
  ]
})
export class DashboardModule { }
