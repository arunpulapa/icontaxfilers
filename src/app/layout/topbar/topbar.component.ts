import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  @Output() menuClick = new EventEmitter<void>();

  username = '';  // 👈 will be set from user
  teams = [
    { id: 't1', name: 'All Teams' },
    { id: 't2', name: 'Tax Filing' },
    { id: 't3', name: 'Audit' }
  ];
  selectedTeam = 't1';

  notifications = [
    { id: 1, text: 'Payment received from Ravi', time: '2h' },
    { id: 2, text: 'New lead: Anita', time: '6h' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUserName() || 'User';
  }

  onMenuClick() {
    this.menuClick.emit();
  }

  onTeamChange(v: any) {
    // keep local for now; later call service
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
