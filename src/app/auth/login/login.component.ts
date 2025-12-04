import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  hidePassword = true;
  errorMessage = '';
  isLoading = false;   // 👈 loader flag

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) { }

  login() {
    if (this.loginForm.invalid || this.isLoading) return;

    const { email, password } = this.loginForm.value;
    this.errorMessage = '';
    this.isLoading = true;

    this.authService
      .login(email!, password!)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res) => {
          if (!res?.token || !res?.user) {
            this.errorMessage = 'Invalid login response';
            return;
          }

          // Save token & user
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          // localStorage.setItem('role', appRole);


          // 🔹 Backend roles → frontend roles
          const backendRole = (res.user.role || '').trim().toLowerCase(); // "admin" | "user" | "client"
          let appRole: string;

          switch (backendRole) {
            case 'admin':
              appRole = 'admin';
              break;

            case 'user':        // backend "User" = TEAM
              appRole = 'team';
              break;

            case 'client':      // backend "Client" = CLIENT
              appRole = 'client';
              break;

            default:
              appRole = 'client';
          }


          localStorage.setItem('role', appRole);

          // 🔹 Redirect by *normalized* role
          if (appRole === 'admin') {
            this.router.navigate(['/admin/dashboard']);
          } else if (appRole === 'team') {
            this.router.navigate(['/teams/dashboard']);
          } else {
            this.router.navigate(['/client/dashboard']);
          }
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Login failed';
        }
      });
  }

}
