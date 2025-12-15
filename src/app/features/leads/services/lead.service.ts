import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
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

  /**
   * Return an options object for HttpClient calls.
   * If dropContentType is true we will remove Content-Type from headers
   * so the browser can set multipart/form-data correctly.
   */
  private httpOptions(dropContentType: boolean = false): { headers?: HttpHeaders | any } {
    const raw = this.authService.getAuthHeaders();

    // If authService returns an HttpHeaders instance, work with it; otherwise assume it's a plain object.
    if (raw instanceof HttpHeaders) {
      let headers = raw;
      if (dropContentType) {
        headers = headers.delete('Content-Type');
      }
      return { headers };
    }

    // If raw is plain object like { 'Authorization': 'Bearer ...' }, convert to HttpHeaders
    try {
      const headers = new HttpHeaders(raw as Record<string, string>);
      return dropContentType ? { headers: headers.delete('Content-Type') } : { headers };
    } catch {
      // fallback: pass raw as-is (some code expects { headers: { ... } })
      return dropContentType ? { headers: (raw as any).delete ? (raw as any).delete('Content-Type') : raw } : { headers: raw };
    }
  }

  /** Safe URL builder that handles trailing slashes and whether baseUrl already contains /api */
  private buildUrl(path: string): string {
    const base = (this.baseUrl || '').replace(/\/+$/, ''); // remove trailing slashes
    // if base already ends with '/api', don't inject another /api
    if (/\/api$/i.test(base)) {
      return `${base}/${path.replace(/^\/+/, '')}`;
    }
    return `${base}/api/${path.replace(/^\/+/, '')}`;
  }

  getLeads(): Observable<any> {
    const url = this.buildUrl('Clients/Get-uploaded-clients');
    return this.http.get<any>(url, this.httpOptions());
  }

  getStatuses(): Observable<string[]> {
    const url = this.buildUrl('WorkFlow/GetStatus');
    return this.http.get<string[]>(url, this.httpOptions());
  }

  getRoles(): Observable<string[]> {
    const url = this.buildUrl('WorkFlow/GetRoles');
    return this.http.get<string[]>(url, this.httpOptions());
  }

  // JSON import endpoint
  importParsed(leads: any[]): Observable<any> {
    const url = this.buildUrl('Clients/ImportParsed');
    return this.http.post<any>(url, leads, this.httpOptions());
  }

  // Excel upload fallback endpoint
uploadExcel(file: File): Observable<HttpResponse<any>> {
  const form = new FormData();
  form.append('file', file, file.name);

  const options = this.httpOptions(true);
  const url = this.buildUrl('Clients/upload-excel');
  console.log('⤴️ Upload to', url);
  console.log('⤴️ Headers for upload:', options);

  // return full HttpResponse
  return this.http.post<any>(url, form, { ...options, observe: 'response' as const });
}


  /** Optional existing API, keep if you still use it somewhere */
  uploadLeads(file: File): Observable<Lead[]> {
    const form = new FormData();
    form.append('file', file, file.name);
    const url = this.buildUrl('Clients/UploadLeads');
    return this.http.post<Lead[]>(url, form, this.httpOptions(true));
  }

  /**
   * Fetch teams (uses ManageTeams endpoint like your screenshot)
   * Returns whatever your API returns; adjust the return type if you have a typed model.
   */
  getTeams(): Observable<any> {
    const base = (this.baseUrl || '').replace(/\/+$/, '');
    const url = /\/api$/i.test(base) ? `${base}/ManageTeams` : `${base}/api/ManageTeams`;
    return this.http.get<any>(url, this.httpOptions());
    // Alternatively: return this.http.get<any>(this.buildUrl('ManageTeams'), this.httpOptions());
  }
}
