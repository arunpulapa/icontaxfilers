import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-leads',
  templateUrl: './dashboard-leads.component.html',
  styleUrls: ['./dashboard-leads.component.scss']
})
export class DashboardLeadsComponent {
stats = [
    { label: 'New Leads', value: 128, meta: 'Added this week', icon: 'person_add', color: 'primary', progress: 75, trend: 12 },
    { label: 'Qualified Leads', value: 64, meta: 'Ready for follow-up', icon: 'verified_user', color: 'accent', progress: 50, trend: -5 },
    { label: 'Converted', value: 32, meta: 'Deals closed', icon: 'check_circle', color: 'primary', progress: 30, trend: 8 },
    { label: 'Lost', value: 16, meta: 'Not interested', icon: 'cancel', color: 'warn', progress: 15, trend: -3 }
  ];

  recentLeads = [
    { name: 'Ravi Kumar', email: 'ravi@test.com', status: 'Qualified', date: new Date() },
    { name: 'Anita Sharma', email: 'anita@test.com', status: 'Converted', date: new Date() },
    { name: 'Manoj Verma', email: 'manoj@test.com', status: 'Lost', date: new Date() },
    { name: 'Sneha Patil', email: 'sneha@test.com', status: 'Qualified', date: new Date() },
    { name: 'Vikas Rao', email: 'vikas@test.com', status: 'New', date: new Date() }
  ];

  leadCols = ['name', 'email', 'status', 'date'];
}
