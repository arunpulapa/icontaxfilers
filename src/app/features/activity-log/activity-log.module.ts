import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivityLogRoutingModule } from './activity-log-routing.module';
import { ActivityLogComponent } from './activity-log.component';
import { ActivityListComponent } from './components/activity-list/activity-list.component';


@NgModule({
  declarations: [
    ActivityLogComponent,
    ActivityListComponent
  ],
  imports: [
    CommonModule,
    ActivityLogRoutingModule
  ]
})
export class ActivityLogModule { }
