import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReferralsRoutingModule } from './referrals-routing.module';
import { ReferralsComponent } from './referrals.component';
import { ReferralListComponent } from './components/referral-list/referral-list.component';


@NgModule({
  declarations: [
    ReferralsComponent,
    ReferralListComponent
  ],
  imports: [
    CommonModule,
    ReferralsRoutingModule
  ]
})
export class ReferralsModule { }
