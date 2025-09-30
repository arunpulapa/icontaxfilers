import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';

export interface Lead {
  name: string;
  email: string;
  phone1: string;
  phone2?: string;
  status: string;
  team: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeadService {

  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  // ✅ Get leads
  getLeads(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Clients/Get-uploaded-clients`);
  }

  // ✅ Get statuses
  getStatuses(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/WorkFlow/GetStatus`);
  }

  // ✅ Get roles/teams
  getRoles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/WorkFlow/GetRoles`);
  }

  // ✅ Upload leads file
  uploadLeads(file: File): Observable<Lead[]> {
    const form = new FormData();
    form.append('file', file, file.name);
    return this.http.post<Lead[]>(`${this.baseUrl}/Clients/UploadLeads`, form);
  }
}
