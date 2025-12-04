import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { environment } from "src/environment/environment";
import { Lead } from "../leads.component";

@Injectable({
  providedIn: 'root'
})
export class LeadService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private authHeaders() {
    return {
      headers: this.authService.getAuthHeaders()
    };
  }

  getLeads(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/Clients/Get-uploaded-clients`,
      this.authHeaders()
    );
  }

  getStatuses(): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.baseUrl}/WorkFlow/GetStatus`,
      this.authHeaders()
    );
  }

  getRoles(): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.baseUrl}/WorkFlow/GetRoles`,
      this.authHeaders()
    );
  }

  // ✅ JSON import endpoint
  importParsed(leads: any[]): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/Clients/ImportParsed`,
      leads,
      this.authHeaders()
    );
  }

  // ✅ Excel upload fallback endpoint
 uploadExcel(file: File): Observable<any> {
    const form = new FormData();
    form.append('file', file, file.name);

    // Start from auth headers and drop any Content-Type,
    // so the browser can set multipart/form-data correctly.
    let headers = this.authService.getAuthHeaders();
    if (headers instanceof HttpHeaders) {
      headers = headers.delete('Content-Type');
    }

    return this.http.post<any>(
      `${this.baseUrl}/Clients/upload-excel`,
      form,
      { headers }
    );
  }

  /** Optional existing API, keep if you still use it somewhere */
  uploadLeads(file: File): Observable<Lead[]> {
    const form = new FormData();
    form.append('file', file, file.name);
    return this.http.post<Lead[]>(
      `${this.baseUrl}/Clients/UploadLeads`,
      form,
    );
  }

}
