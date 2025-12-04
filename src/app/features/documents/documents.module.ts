import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentsRoutingModule } from './documents-routing.module';
import { DocumentsComponent } from './documents.component';
import { DocumentListComponent } from './components/document-list/document-list.component';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatCardModule } from "@angular/material/card";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    DocumentsComponent,
    DocumentListComponent
  ],
  imports: [
    CommonModule,
    DocumentsRoutingModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
     MatInputModule,  
    MatSelectModule,
]
})
export class DocumentsModule { }
