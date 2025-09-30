import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from '../../../../src/environment/environment';

export interface Lead {
  name: string;
  email: string;
  phone1: string;
  phone2?: string;
  status: string;
  team: string;
}

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss']
})
export class LeadsComponent {

  displayedColumns: string[] = ['select', 'name', 'email', 'phone1', 'phone2', 'status', 'team', 'actions'];
  dataSource = new MatTableDataSource<Lead>([]);
  selection = new SelectionModel<Lead>(true, []);

  teams: string[] = ['All Teams'];
  statuses: string[] = ['All Statuses'];

  filterValues = {
    search: '',
    team: 'All Teams',
    status: 'All Statuses'
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadLeads();
    this.loadStatuses();
    this.loadRoles();

    this.dataSource.filterPredicate = (data: Lead, filter: string): boolean => {
      const f = JSON.parse(filter);
      const searchable = (data.name + ' ' + data.email + ' ' + (data.phone1 || '') + ' ' + (data.phone2 || '') + ' ' + data.team + ' ' + data.status).toLowerCase();

      const searchMatch = f.search ? searchable.indexOf(f.search.toLowerCase()) !== -1 : true;
      const teamMatch = f.team && f.team !== 'All Teams' ? data.team === f.team : true;
      const statusMatch = f.status && f.status !== 'All Statuses' ? data.status === f.status : true;

      return searchMatch && teamMatch && statusMatch;
    };
  }

  // ✅ Load data
  loadLeads() {
    this.http.get<any[]>(`${environment.apiBaseUrl}/Clients/Get-uploaded-clients`)
      .subscribe({
        next: (res) => {
          const leads: Lead[] = res.map(item => ({
            name: item.name,
            email: item.email,
            phone1: item.contact,
            phone2: item.contact2,
            status: item.status,
            team: item.team || 'UNASSIGNED'
          }));
          this.dataSource.data = leads;
          this.applyFilter();
        },
        error: (err) => console.error('Failed to load leads', err)
      });
  }

  loadStatuses() {
    this.http.get<string[]>(`${environment.apiBaseUrl}/WorkFlow/GetStatus`)
      .subscribe({
        next: (res) => this.statuses = ['All Statuses', ...res],
        error: (err) => console.error('Failed to load statuses', err)
      });
  }

  loadRoles() {
    this.http.get<string[]>(`${environment.apiBaseUrl}/WorkFlow/GetRoles`)
      .subscribe({
        next: (res) => this.teams = ['All Teams', ...res],
        error: (err) => console.error('Failed to load roles/teams', err)
      });
  }

  applyFilter() {
    this.dataSource.filter = JSON.stringify(this.filterValues);
    this.selection.clear();
  }

  // ✅ File Upload
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];

    const form = new FormData();
    form.append('file', file, file.name);

    this.http.post<Lead[]>(`${environment.apiBaseUrl}/Clients/UploadLeads`, form)
      .subscribe({
        next: (res) => {
          if (Array.isArray(res)) {
            this.dataSource.data = [...this.dataSource.data, ...res];
            this.applyFilter();
          }
        },
        error: (err) => console.error('Upload failed:', err)
      });

    input.value = '';
  }

  // ✅ Selection Helpers
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numRows > 0 && numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.filteredData.forEach(row => this.selection.select(row));
    }
  }

  checkboxLabel(row?: Lead): string {
    if (!row) return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.name}`;
  }

  // ✅ Actions
  edit(row: Lead) { console.log('Edit', row); }
  assign(row: Lead) { console.log('Assign', row); }
  remove(row: Lead) { console.log('Remove', row); }
}
