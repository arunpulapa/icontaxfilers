import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-clients',
  templateUrl: './dashboard-clients.component.html',
  styleUrls: ['./dashboard-clients.component.scss']
})
export class DashboardClientsComponent {

  stats = [
    { label: 'New Clients', value: 621, icon: 'person_add', color: 'primary' },
    { label: 'Existing Clients', value: 2258, icon: 'groups', color: 'accent' },
    { label: 'Documents Pending', value: 0, icon: 'description', color: 'warn' },
    { label: 'Paid Clients', value: 248, icon: 'payments', color: 'primary' },
    { label: 'Voice Mail', value: 71, icon: 'voicemail', color: 'accent' },
    { label: 'Preparation Pending', value: 0, icon: 'pending_actions', color: 'warn' },
    { label: 'Pending Amount', value: 150, icon: 'attach_money', color: 'warn' },
    { label: 'Payment Pending Clients', value: 0, icon: 'hourglass_empty', color: 'accent' },
    { label: 'Partial Payment Clients', value: 0, icon: 'account_balance_wallet', color: 'primary' },
    { label: 'Partial Amount', value: 0, icon: 'money_off', color: 'warn' },
    { label: 'Completed', value: 0, icon: 'done_all', color: 'primary' }
  ];
}
