import { Component, OnInit } from '@angular/core';

import { Team } from '../../core/models/team.model';
import { TeamService } from './services/team.service';
@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
 teams: Team[] = [];
cols: string[] = ['name', 'lead', 'members', 'status', 'actions'];
  users = [
    { id: 'u1', name: 'Ravi Kumar', email: 'ravi@test.com' },
    { id: 'u2', name: 'Anita Sharma', email: 'anita@test.com' },
    { id: 'u3', name: 'Syam Gupta', email: 'syam@test.com' }
  ];
  selectedMembers: string[] = [];
  constructor(private teamService: TeamService) {}
 save() {
    console.log('Selected members:', this.selectedMembers);
    // later: call teamService.updateTeamMembers(...)
  }
  ngOnInit(): void {
    this.teamService.getTeams().subscribe(t => (this.teams = t));
  }

  delete(id: string) {
    this.teamService.deleteTeam(id);
  }
}
