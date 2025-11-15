import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeamService } from '../../services/team.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Team } from 'src/app/core/models/team.model';

@Component({
  selector: 'app-team-form',
  templateUrl: './team-form.component.html',
  styleUrls: ['./team-form.component.scss']
})
export class TeamFormComponent {
 form!: FormGroup;
  editing = false;
  teamId!: string;

  // ⚡ Mock users until you connect with user.service
  users = [
    { id: 'u1', name: 'Ravi Kumar' },
    { id: 'u2', name: 'Anita Sharma' },
    { id: 'u3', name: 'Syam Gupta' }
  ];

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      leadId: ['', Validators.required],
      status: ['active', Validators.required]
    });
    this.teamId = this.route.snapshot.paramMap.get('id') || '';
    if (this.teamId) {
      const team = this.teamService.getTeam(this.teamId);
      if (team) {
        this.editing = true;
        this.form.patchValue(team);
      }
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    const team: Team = {
      id: this.teamId || Date.now().toString(),
      name: this.form.value.name,
      leadId: this.form.value.leadId,
      members: [], // later handled in Team Members screen
      status: this.form.value.status,
      createdAt: new Date()
    };

    if (this.editing) {
      this.teamService.updateTeam(team);
    } else {
      this.teamService.addTeam(team);
    }
    this.router.navigate(['/teams']);
  }
}
