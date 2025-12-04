import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ClientService } from 'src/app/client/services/client.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userName = 'User';

  stats = {
    activeCases: 0,
    pendingDocs: 0,
    completedTasks: 0,
    upcomingDeadlines: 0
  };

  recentActivity: any[] = [];
  deadlines: any[] = [];

  constructor(
    private auth: AuthService,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    const user = this.auth.getUser?.();
    if (user) {
      this.userName = user.firstName || user.email || 'User';
    }

    this.loadDashboardStats();
  }

  private asNumber(value: any): number {
    if (typeof value === 'number') return value;
    if (value && typeof value === 'object') {
      // most common backend shapes: { count: 5 }, { total: 5 }, { data: 5 }
      return value.count ?? value.total ?? value.data ?? 0;
    }
    return 0;
  }

  loadDashboardStats() {
    forkJoin({
      verified: this.clientService.getVerifiedDocumentsCount(),
      pending: this.clientService.getPendingDocumentsCount(),
      rejected: this.clientService.getRejectedDocumentsCount()
    }).subscribe({
      next: ({ verified, pending, rejected }) => {
        this.stats.completedTasks = this.asNumber(verified);  // verified docs
        this.stats.pendingDocs = this.asNumber(pending);      // pending docs
        this.stats.activeCases = this.asNumber(rejected);     // rejected docs
        this.stats.upcomingDeadlines = 0;                     // still static for now
      },
      error: (err) => {
        console.error('❌ Failed to load dashboard stats', err);
      }
    });
  }

  onUploadDocs() {}
  onContactStaff() {}
  onRequestService() {}
}
