import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-referrals',
  templateUrl: './dashboard-referrals.component.html',
  styleUrls: ['./dashboard-referrals.component.scss']
})
export class DashboardReferralsComponent {
stats = [
    { label: 'Total Referrals', value: 45, meta: 'All time', icon: 'share', color: 'primary', progress: 70, trend: 5 },
    { label: 'Converted Referrals', value: 20, meta: 'Closed successfully', icon: 'check_circle', color: 'accent', progress: 40, trend: 10 },
    { label: 'Pending Referrals', value: 15, meta: 'Waiting response', icon: 'hourglass_bottom', color: 'warn', progress: 30, trend: -3 },
    { label: 'Referral Bonus (₹)', value: 5000, meta: 'Earned rewards', icon: 'card_giftcard', color: 'primary', progress: 50, trend: 7 }
  ];

  recentReferrals = [
    { name: 'Ravi Kumar', client: 'Anita Sharma', status: 'Converted', date: new Date() },
    { name: 'Suresh Verma', client: 'Manoj Gupta', status: 'Pending', date: new Date() },
    { name: 'Sneha Patil', client: 'Kiran Rao', status: 'Converted', date: new Date() },
    { name: 'Amit Joshi', client: 'Vikas Rao', status: 'Rejected', date: new Date() }
  ];

  refCols = ['name', 'client', 'status', 'date'];
}
