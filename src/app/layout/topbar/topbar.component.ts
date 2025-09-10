import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
  @Output() menuClick = new EventEmitter<void>();
username = 'Arun';
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

  onMenuClick() { this.menuClick.emit(); }
  onTeamChange(v: any) { /* keep local for now; later call service */ }
  logout() { /* call auth service */ }
}
