import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { DocumentsComponent } from './features/documents/documents.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from "@angular/material/select";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './features/profile/profile.component';
import { SettingsComponent } from './features/settings/settings.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    DashboardComponent,
    DocumentsComponent,
    ProfileComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    MatIconModule,
    MatFormFieldModule,
    MatIconModule,
    MatOptionModule,
    MatTableModule,
    MatSelectModule,
    FormsModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule
]
})
export class ClientModule { }
