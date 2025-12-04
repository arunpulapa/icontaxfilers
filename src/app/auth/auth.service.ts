import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  lastName: any;
  firstName: any;
  id: number;
  name: string;
  email: string;
  role: string;   
}

interface LoginResponse {
  user: User;
  token: string;
  // add other fields returned by your API if any
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://aspnetclusters-205348-0.cloudclusters.net'; // your API base

 constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/api/Auth/login`, { email, password });
  }

  // 🔹 used by interceptor
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }
  // 🔹 used by sidebar / guards
  getRole(): string | null {
    return localStorage.getItem('role');
  }
  getUserName(): string {
  const user = this.getUser();
  return user ? `${user.firstName}` : '';
}

  getUser(): User | null {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  logout() {
    localStorage.clear();
  }


}
