import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 private currentUser = {
    id: '1',
    name: 'Admin User',
    email: 'admin@test.com',
    role: 'admin'  // or 'team-lead', 'team-mate'
  };

  getCurrentUser() {
    return this.currentUser;
  }
}
