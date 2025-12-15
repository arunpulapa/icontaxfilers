import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environment/environment';
import { AuthService } from 'src/app/auth/auth.service';
import { Client } from 'src/app/core/models/client.model';

@Injectable({ providedIn: 'root' })
export class ClientService {
  addClient(newClient: Client) {
    throw new Error('Method not implemented.');
  }
  private baseUrl = `${environment.apiBaseUrl}/Clients`; // as in your code

  constructor(private http: HttpClient, private auth: AuthService) {}

  getClients(): Observable<Client[]> {
    const url = `${this.baseUrl}`;
    const params = new HttpParams().set('role', 'Client'); // adjust if backend expects other value

    return this.http.get<any[]>(url, {
      headers: this.auth.getAuthHeaders(),
      params
    }).pipe(
      map(items => (items || []).map(i => this.normalize(i)))
    );
  }

  getClient(id: string | number): Observable<Client> {
    const url = `${this.baseUrl}/Get/${id}`;
    return this.http.get<any>(url, { headers: this.auth.getAuthHeaders() }).pipe(
      map(i => this.normalize(i))
    );
  }

  createClient(payload: any) {
    const url = `${this.baseUrl}/Create`;
    return this.http.post(url, payload, { headers: this.auth.getAuthHeaders(), observe: 'response' as const });
  }

  updateClient(id: string | number, payload: any) {
    const url = `${this.baseUrl}/Update/${id}`;
    return this.http.put(url, payload, { headers: this.auth.getAuthHeaders(), observe: 'response' as const });
  }

  deleteClient(id: string | number) {
    const url = `${this.baseUrl}/Delete/${id}`;
    return this.http.delete(url, { headers: this.auth.getAuthHeaders(), observe: 'response' as const });
  }

  getClientsPaged(page = 0, pageSize = 25, search = ''): Observable<{ items: Client[]; total: number }> {
    const url = `${this.baseUrl}/GetPaged`;
    let params = new HttpParams().set('page', String(page)).set('pageSize', String(pageSize));
    if (search) params = params.set('search', search);

    return this.http.get<{ items: any[]; total: number }>(url, {
      headers: this.auth.getAuthHeaders(),
      params
    }).pipe(
      map(r => ({ items: (r.items || []).map(i => this.normalize(i)), total: r.total ?? 0 }))
    );
  }

  private normalize(i: any): Client {
    i = i || {};
    const first = (i.firstName ?? '').toString().trim();
    const last = (i.lastName ?? '').toString().trim();
    const name = (i.name ?? `${first} ${last}`).toString().trim() || i.email || '';
    const rawStatus = (i.status ?? i.role ?? '').toString();
    return {
      id: i.id ?? i._id ?? '',
      name,
      email: i.email ?? null,
      contact: i.contact ?? null,
      contact2: i.contact2 ?? null,
      phone: (i.contact ?? i.phone ?? '') || null,
      status: rawStatus || null,
      team: i.teamName ?? i.team ?? null,
      role: i.role ?? null
    };
  }
}
