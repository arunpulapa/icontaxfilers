import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
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

ngOnInit(): void {
  const params = new URLSearchParams(window.location.search);

  const token = params.get('token');
  const userParam = params.get('user');

  // 🔍 CONSOLE RAW VALUES
  console.log('🔑 Token from URL:', token);
  console.log('👤 Encoded user from URL:', userParam);

  if (token && userParam) {
    // Save token
    sessionStorage.setItem('token', token);

    // Decode + parse user
    const user = JSON.parse(decodeURIComponent(userParam));

    // 🔍 CONSOLE PARSED USER
    console.log('✅ Parsed user object:', user);

    // Save user & role
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('role', user.role.toLowerCase());

    // 🔍 VERIFY STORAGE
    console.log(
      '📦 SessionStorage user:',
      JSON.parse(sessionStorage.getItem('user')!)
    );
    console.log(
      '📦 SessionStorage role:',
      sessionStorage.getItem('role')
    );

    // Clean URL
    window.history.replaceState({}, '', window.location.pathname);

    // Optional redirect
    if (user.role.toLowerCase() === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else if (user.role.toLowerCase() === 'user') {
      this.router.navigate(['/teams/dashboard']);
    } else {
      this.router.navigate(['/client/dashboard']);
    }
  }
}




  



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
          sessionStorage.setItem('token', res.token);
          sessionStorage.setItem('user', JSON.stringify(res.user));
          // sessionStorage.setItem('role', appRole);


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


          sessionStorage.setItem('role', appRole);

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
