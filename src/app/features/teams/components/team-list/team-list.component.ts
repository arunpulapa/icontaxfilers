import { Component } from '@angular/core';
// Update the import path below to the correct location of team.model.ts
import { Team } from 'src/app/core/models/team.model';
import { TeamService } from '../../services/team.service';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss']
})
export class TeamListComponent {
 teams: Team[] = [];
  cols = ['name', 'lead', 'members', 'actions'];

  constructor(private teamService: TeamService) {}

  ngOnInit() {
    this.teamService.getTeams().subscribe(t => (this.teams = t));
  }

  delete(id: string) {
    this.teamService.deleteTeam(id);
  }
}
