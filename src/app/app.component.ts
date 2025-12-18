import { Component, OnInit } from '@angular/core';
import { LayoutModule } from "./layout/layout.module";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'icon-tax-frontend';

   ngOnInit(): void {
    const params = new URLSearchParams(window.location.search);

    const token = params.get('token');
    const userParam = params.get('user');

    console.log('🔑 Token:', token);
    console.log('👤 User param:', userParam);

    if (token && userParam) {
      sessionStorage.setItem('token', token);

      const user = JSON.parse(decodeURIComponent(userParam));
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('role', user.role.toLowerCase());

      console.log('✅ User stored:', user);

      // 🔥 Clean URL without reloading
      window.history.replaceState({}, '', window.location.pathname);
    }
  }

}
