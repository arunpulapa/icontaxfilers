import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    // Other feature routes
  { path: 'dashboard', loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule) }, 
  { path: 'clients', loadChildren: () => import('../clients/clients.module').then(m => m.ClientsModule) },
  { path: 'payments', loadChildren: () => import('../payments/payments.module').then(m => m.PaymentsModule) }, 
  { path: 'invoices', loadChildren: () => import('../invoices/invoices.module').then(m => m.InvoicesModule) }, 
  { path: 'leads', loadChildren: () => import('../leads/leads.module').then(m => m.LeadsModule) }, 
  { path: 'referrals', loadChildren: () => import('../referrals/referrals.module').then(m => m.ReferralsModule) }, 
  { path: 'teams', loadChildren: () => import('../teams/teams.module').then(m => m.TeamsModule) }, 
  { path: 'reports', loadChildren: () => import('../reports/reports.module').then(m => m.ReportsModule) }, 
  { path: 'users', loadChildren: () => import('../users/users.module').then(m => m.UsersModule) }, 
  { path: 'documents', loadChildren: () => import('../documents/documents.module').then(m => m.DocumentsModule) }, 
  // { path: 'activity-log', loadChildren: () => import('../activity-log/activity-log.module').then(m => m.ActivityLogModule) }, 
  { path: 'settings', loadChildren: () => import('../settings/settings.module').then(m => m.SettingsModule) },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
