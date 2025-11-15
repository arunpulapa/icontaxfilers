import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environment/environment';

export interface Team {
  teamName: string;
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  managerDeskNumber: string | null;
  managerWhatsApp: string;
  copyPaste: boolean;
  memberCount: number;
}

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
  @ViewChild('addTeamDialog') addTeamDialog!: TemplateRef<any>;
  @ViewChild('renameTeamDialog') renameTeamDialog!: TemplateRef<any>;

  displayedColumns: string[] = [
    'teamName',
    'managerName',
    'managerEmail',
    'managerPhone',
    'managerDeskNumber',
    'managerWhatsApp',
    'memberCount',
    'copyPaste',
    'actions'
  ];

  dataSource = new MatTableDataSource<Team>([]);
  teamForm!: FormGroup;
  renameForm!: FormGroup;
  selectedTeam: Team | null = null;

  private apiUrl = `${environment.apiBaseUrl}/ManageTeams`;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Forms
    this.teamForm = this.fb.group({
      teamName: ['', Validators.required],
      managerId: ['', Validators.required]
    });

    this.renameForm = this.fb.group({
      newTeamName: ['', Validators.required]
    });

    // Load data
    this.loadTeams();

    // Custom filter predicate
    this.dataSource.filterPredicate = (data: Team, filter: string) => {
      const search = filter.trim().toLowerCase();
      return (
        data.teamName?.toLowerCase().includes(search) ||
        data.managerName?.toLowerCase().includes(search) ||
        data.managerEmail?.toLowerCase().includes(search) ||
        data.managerPhone?.toLowerCase().includes(search) ||
        data.managerDeskNumber?.toLowerCase().includes(search) ||
        data.managerWhatsApp?.toLowerCase().includes(search)
      );
    };
  }

  // 🔍 Search
  applyFilter(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    this.dataSource.filter = input.trim().toLowerCase();
  }

  // ➕ Open Add Dialog
  openAddTeamDialog(): void {
    this.dialog.open(this.addTeamDialog, {
      width: '400px',
      disableClose: true
    });
  }

  // ✅ Add Team
  createTeam(): void {
    if (this.teamForm.invalid) {
      this.teamForm.markAllAsTouched();
      this.showBanner('⚠️ Please fill out all required fields.', 'Close');
      return;
    }

    const payload = this.teamForm.value;

    this.http.post(`${this.apiUrl}/create`, payload).subscribe({
      next: () => {
        this.showBanner('✅ Team created successfully!', 'OK');
        this.dialog.closeAll();
        this.teamForm.reset();
        this.loadTeams();
      },
      error: (err) => {
        console.error('Error creating team:', err);
        this.showBanner('❌ Failed to create team.', 'Dismiss', true);
      }
    });
  }

  // 📋 Load Teams
  loadTeams(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (response) => {
        this.dataSource.data = response.map(team => ({
          teamName: team.teamName,
          managerName: team.managerName,
          managerEmail: team.managerEmail,
          managerPhone: team.managerPhone,
          managerDeskNumber: team.managerDeskNumber,
          managerWhatsApp: team.managerWhatsApp,
          copyPaste: team.copyPaste,
          memberCount: team.memberCount
        }));
      },
      error: (err) => {
        console.error('❌ Error loading teams:', err);
        this.showBanner('⚠️ Failed to load team data.', 'Retry');
      }
    });
  }

  // ✏️ Open Rename Dialog
  openRenameDialog(team: Team): void {
    this.selectedTeam = team;
    this.renameForm.reset({ newTeamName: team.teamName });

    this.dialog.open(this.renameTeamDialog, {
      width: '400px',
      disableClose: true
    });
  }

  // ✅ Rename Team
  renameTeam(): void {
    if (!this.selectedTeam || this.renameForm.invalid) {
      this.showBanner('⚠️ Please enter a valid new name.', 'Close');
      return;
    }

    const payload = {
      oldTeamName: this.selectedTeam.teamName,
      newTeamName: this.renameForm.value.newTeamName.trim()
    };

    this.http.post(`${this.apiUrl}/rename`, payload).subscribe({
      next: () => {
        this.showBanner(`✅ Team renamed to "${payload.newTeamName}"`, 'OK');
        this.dialog.closeAll();
        this.loadTeams();
      },
      error: (err) => {
        console.error('❌ Error renaming team:', err);
        this.showBanner('❌ Failed to rename team.', 'Dismiss', true);
      }
    });
  }

  // 🗑️ Delete Team
  deleteTeam(team: Team): void {
    const confirmDelete = confirm(`Are you sure you want to delete team: ${team.teamName}?`);
    if (!confirmDelete) return;

    this.http.delete(`${this.apiUrl}/${encodeURIComponent(team.teamName)}`).subscribe({
      next: () => {
        this.showBanner('🗑️ Team deleted successfully.', 'OK');
        this.dataSource.data = this.dataSource.data.filter(t => t !== team);
      },
      error: (err) => {
        console.error('Error deleting team:', err);
        this.showBanner('❌ Failed to delete team.', 'Dismiss', true);
      }
    });
  }

  // 🌟 Snackbar (banner) utility
  private showBanner(message: string, action: string, isError: boolean = false): void {
    this.snackBar.open(message, action, {
      duration: 4000,
      panelClass: isError ? ['banner-error'] : ['banner-success'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
