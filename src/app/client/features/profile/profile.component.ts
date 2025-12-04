import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { ClientService } from 'src/app/client/services/client.service'; // adjust path
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profileForm!: FormGroup;
  loading = false;

  // what we show in left card
  fullName = 'User';
  roleLabel = 'Client Portal';
  email = '';

  userId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private clientService: ClientService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadFromLocalStorage();
  }

  private buildForm(): void {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      whatsAppNumber: [''],
      deskNumber: ['']
    });
  }

  /** read user from localStorage (AuthService.getUser uses localStorage) */
  private loadFromLocalStorage(): void {
    const user = this.auth.getUser?.() || this.safeGetUserFromLocalStorage();

    if (!user) return;

    this.userId = user.id || null;
    this.fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
    this.email = user.email || '';

    const storedRole = (localStorage.getItem('role') || '').toLowerCase();
    this.roleLabel =
      storedRole === 'admin' ? 'Admin Console' :
      storedRole === 'team'  ? 'Team Console'  :
                               'Client Portal';

    this.profileForm.patchValue({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || user.mobile || '',
      whatsAppNumber: user.whatsAppNumber || '',
      deskNumber: user.deskNumber || ''
    });
  }

  private safeGetUserFromLocalStorage(): any | null {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid || !this.userId) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const payload = this.profileForm.value;
    this.loading = true;

    // adjust updateProfile() signature to your API if needed
    this.clientService.updateProfile(this.userId, payload).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Profile updated successfully', 'OK', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });

        // also update localStorage so topbar/sidebar show fresh name
        const existing = this.safeGetUserFromLocalStorage() || {};
        const updated = { ...existing, ...payload };
        localStorage.setItem('user', JSON.stringify(updated));
        this.fullName = `${updated.firstName || ''} ${updated.lastName || ''}`.trim() || 'User';
        this.email = updated.email || '';
      },
      error: (err) => {
        console.error('Profile update failed', err);
        this.loading = false;
        this.snackBar.open('Failed to update profile', 'OK', {
          duration: 3000,
          panelClass: ['banner-error'],
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }
}
