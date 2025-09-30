import { Component, OnInit } from '@angular/core';

// import { Team } from '../../core/models/team.model';
import { TeamService } from './services/team.service';
import { MatTableDataSource } from '@angular/material/table';

export interface Team {
  team: string;
  leadName: string;
  email: string;
  phone: string;
  deskNumber: string;
  whatsapp: string;
  copyPaste: boolean;
}

const SAMPLE_TEAMS: Team[] = [
  { team: 'COMMANDERS', leadName: 'Masters', email: 'commanders@gtaxfile.com', phone: '9999999999', deskNumber: '9999999999', whatsapp: '9999999999', copyPaste: false },
  { team: 'TERMINATORS', leadName: 'Masters', email: 'terminators@gtaxfile.com', phone: '9999999999', deskNumber: '9999999999', whatsapp: '9999999999', copyPaste: true },
  { team: 'MONSTERS', leadName: 'Masters', email: 'monsters@gtaxfile.com', phone: '9999999999', deskNumber: '9999999999', whatsapp: '9999999999', copyPaste: false },
  { team: 'PHOENIX', leadName: 'Prashanth Kajra', email: 'kajra@gtaxfile.com', phone: '870012234', deskNumber: '870012234', whatsapp: '8970012234', copyPaste: true },
  { team: 'FIGHTERS', leadName: 'Akhil Raj', email: 'akhilraj@gtaxfile.com', phone: '987654356', deskNumber: '', whatsapp: '', copyPaste: false }
];

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
 displayedColumns: string[] = ['team', 'leadName', 'email', 'phone', 'deskNumber', 'whatsapp', 'copyPaste', 'actions'];
  dataSource = new MatTableDataSource<Team>(SAMPLE_TEAMS);

  searchText = '';

  applyFilter() {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  editTeam(team: Team) {
    console.log('Edit Team', team);
  }

  deleteTeam(team: Team) {
    console.log('Delete Team', team);
  }

  addTeam() {
    console.log('Add new team');
  }
}
