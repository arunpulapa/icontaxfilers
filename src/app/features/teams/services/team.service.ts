import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Team } from '../../../core/models/team.model';

@Injectable({ providedIn: 'root' })
export class TeamService {
private teams: Team[] = [
    { id: '1', name: 'Tax Filing', leadId: 'u1', members: ['u2', 'u3'], status: 'active', createdAt: new Date() },
    { id: '2', name: 'Audit', leadId: 'u4', members: ['u5'], status: 'inactive', createdAt: new Date() }
  ];

  private teams$ = new BehaviorSubject<Team[]>(this.teams);

  getTeams() {
    return this.teams$.asObservable();
  }

  getTeam(id: string) {
    return this.teams.find(t => t.id === id);
  }

  addTeam(team: Team) {
    this.teams.push({ ...team, id: Date.now().toString(), createdAt: new Date() });
    this.teams$.next(this.teams);
  }

  updateTeam(updated: Team) {
    const idx = this.teams.findIndex(t => t.id === updated.id);
    if (idx > -1) {
      this.teams[idx] = updated;
      this.teams$.next(this.teams);
    }
  }

  deleteTeam(id: string) {
    this.teams = this.teams.filter(t => t.id !== id);
    this.teams$.next(this.teams);
  }
}
