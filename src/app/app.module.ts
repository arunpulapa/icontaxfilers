import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { DashboardComponent } from './teams/features/dashboard/dashboard.component';
import { ClientsComponent } from './teams/features/clients/clients.component';
import { TaskmanagmentComponent } from './teams/features/taskmanagment/taskmanagment.component';
import { MyclientsComponent } from './teams/features/myclients/myclients.component';
import { AssignedleadsComponent } from './teams/features/assignedleads/assignedleads.component';
import { DocumentsComponent } from './teams/features/documents/documents.component';
import { ProfileComponent } from './teams/features/profile/profile.component';
import { SettingsComponent } from './teams/features/settings/settings.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ClientsComponent,
    TaskmanagmentComponent,
    MyclientsComponent,
    AssignedleadsComponent,
    DocumentsComponent,
    ProfileComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule,
    LayoutModule,
    HttpClientModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule

  ],
  providers: [ {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
