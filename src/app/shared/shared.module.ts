import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiCardComponent } from './components/kpi-card/kpi-card.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';



@NgModule({
  declarations: [
    KpiCardComponent,
    DataTableComponent,
    ConfirmDialogComponent,
    FileUploaderComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
