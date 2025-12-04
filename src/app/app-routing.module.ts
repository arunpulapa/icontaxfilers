import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout/layout.component';

const routes: Routes = [
  // Redirect to login when opening the app
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // LOGIN MODULE (NO LAYOUT)
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/login/login.module').then(m => m.LoginModule)
  },

  // PROTECTED AREA (HAS LAYOUT)
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'admin',
        loadChildren: () =>
          import('./features/admin/admin.module').then(m => m.AdminModule)
      },
      {
        path: 'client',
        loadChildren: () =>
          import('./client/client.module').then(m => m.ClientModule)
      },
      {
        path: 'teams',
        loadChildren: () =>
          import('./teams/teams/teams.module').then(m => m.TeamsModule)
      }
    ]
  },

  // ANY UNKNOWN ROUTE → LOGIN
  { path: '**', redirectTo: 'login' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
