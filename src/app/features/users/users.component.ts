import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from '../../../environment/environment';

export interface User {
  id?: string;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  deskNumber?: string | null;
  whatsAppNumber?: string | null;
  role: string;
  reportsTo?: string | null;
  teamName?: string | null;
  targetAmount?: number | null;
  discountAmount?: number | null;
  createdAt?: string | null;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @ViewChild('addUserDialog') addUserDialog!: TemplateRef<any>;

  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'deskNumber',
    'whatsAppNumber',
    'role',
    'teamName',
    'actions'
  ];

  dataSource = new MatTableDataSource<User>([]);
  userForm!: FormGroup;
  loading = false;

  private apiUrl = `${environment.apiBaseUrl}/Users`;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      deskNumber: [''],
      whatsAppNumber: [''],
      role: ['', Validators.required],
      reportsTo: [''],
      teamName: [''],
      targetAmount: [0],
      discountAmount: [0]
    });

    this.loadUsers();
  }

  /** 🔹 Load Users (integrates with `{ total, items }` response) */
  loadUsers(): void {
    this.loading = true;

    // Expecting: { total: number, items: User[] }
    this.http.get<{ total: number; items: User[] }>(`${this.apiUrl}`).subscribe({
      next: (res) => {
        this.dataSource.data = res.items ?? [];
        console.log(`Loaded ${res.items?.length ?? 0} users (total reported: ${res.total})`);
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load users', err);
        this.loading = false;
        this.showBanner('❌ Failed to load users', true);
      }
    });
  }

  /** 🔹 Open Add User Dialog */
  openAddUserDialog(): void {
    this.dialog.open(this.addUserDialog, {
      width: '420px',
      height: '1000px',
      disableClose: true,
      panelClass: 'custom-user-dialog'
    });
  }

  /** 🔹 Create User */
  createUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    // Build payload using camelCase to match the example schema
    const payload = {
      firstName: this.userForm.value.firstName,
      lastName: this.userForm.value.lastName,
      email: this.userForm.value.email,
      password: this.userForm.value.password,
      phone: this.userForm.value.phone || '',
      deskNumber: this.userForm.value.deskNumber || '',
      whatsAppNumber: this.userForm.value.whatsAppNumber || '',
      role: this.userForm.value.role,
      reportsTo: this.userForm.value.reportsTo || null,
      teamName: this.userForm.value.teamName || 'Default',
      targetAmount: Number(this.userForm.value.targetAmount) || 0,
      discountAmount: Number(this.userForm.value.discountAmount) || 0
    };

    console.log('📤 Sending payload (JSON):', payload);

    // Debugging: observe full response while investigating; remove observe after debugging if you like
    this.http.post(`${this.apiUrl}/Create`, payload, {
      headers: { 'Content-Type': 'application/json' },
      observe: 'response'
    }).subscribe({
      next: (resp) => {
        this.dialog.closeAll();
        this.userForm.reset();
        this.loadUsers();
        this.loading = false;
        this.showBanner('✅ User created successfully!');
        console.log('✅ Create response status:', resp.status, resp);
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Error creating user:', err);

        const status = err.status ?? 'no-status';
        const body = err.error ?? JSON.stringify(err);
        console.warn(`HTTP ${status} — response body:`, body);

        if (err.error?.errors) {
          const messages = Object.entries(err.error.errors)
            .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`)
            .join('\n');
          this.showBanner(`❌ Validation errors:\n${messages}`, true);
        } else if (err.error?.title) {
          this.showBanner(`❌ ${err.error.title}`, true);
        } else {
          this.showBanner(`❌ Unknown error (HTTP ${status})`, true);
        }
      }
    });
  }

  /** 🔹 Snackbar Banner Utility */
  private showBanner(message: string, isError = false): void {
    this.snackBar.open(message, 'OK', {
      duration: 3000,
      panelClass: isError ? ['banner-error'] : ['banner-success'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
