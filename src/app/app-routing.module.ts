import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule) }, 
  { path: 'clients', loadChildren: () => import('./features/clients/clients.module').then(m => m.ClientsModule) },
   { path: 'payments', loadChildren: () => import('./features/payments/payments.module').then(m => m.PaymentsModule) }, 
   { path: 'invoices', loadChildren: () => import('./features/invoices/invoices.module').then(m => m.InvoicesModule) }, 
   { path: 'leads', loadChildren: () => import('./features/leads/leads.module').then(m => m.LeadsModule) }, 
   { path: 'referrals', loadChildren: () => import('./features/referrals/referrals.module').then(m => m.ReferralsModule) }, 
   { path: 'teams', loadChildren: () => import('./features/teams/teams.module').then(m => m.TeamsModule) }, 
   { path: 'reports', loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule) }, 
   { path: 'users', loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule) }, 
   { path: 'documents', loadChildren: () => import('./features/documents/documents.module').then(m => m.DocumentsModule) }, 
   { path: 'activity-log', loadChildren: () => import('./features/activity-log/activity-log.module').then(m => m.ActivityLogModule) }, 
   { path: 'settings', loadChildren: () => import('./features/settings/settings.module').then(m => m.SettingsModule) },
  { path: '**', redirectTo: 'dashboard' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
