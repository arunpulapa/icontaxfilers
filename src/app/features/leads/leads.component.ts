import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from '../../../../src/environment/environment';
import { Subject, debounceTime } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';

export interface Lead {
  name: string;
  email: string;
  phone1: string;
  phone2?: string;
  status: string;
  team: string;
}

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.scss']
})
export class LeadsComponent implements OnInit {
  displayedColumns: string[] = [
    'select', 'name', 'email', 'phone1', 'phone2', 'status', 'team', 'actions'
  ];
  dataSource = new MatTableDataSource<Lead>([]);
  selection = new SelectionModel<Lead>(true, []);

  teams: string[] = ['All Teams'];
  statuses: string[] = ['All Statuses'];

  searchSubject = new Subject<string>();
  loading = false;

  // total count shown in UI
  total = 0;

  filterValues = {
    search: '',
    team: 'All Teams',
    status: 'All Statuses'
  };

  // header alias map used by the mapping logic
  private headerAliases: Record<string, string[]> = {
    name: ['name', 'full name', 'client name', 'lead name', 'customer', 'contact person'],
    email: ['email', 'email address', 'e-mail', 'mail'],
    contact: ['phone', 'phone1', 'contact', 'mobile', 'phone number', 'contact no', 'mobile no'],
    contact2: ['phone2', 'secondary phone', 'alt phone', 'alternate phone', 'contact2'],
    status: ['status', 'lead status', 'state'],
    team: ['team', 'group', 'assigned team', 'role']
  };

  // regexes for inference
  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private phoneRegex = /^[+()0-9\-\s]{6,20}$/;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadLeads();
    this.loadStatuses();
    this.loadRoles();

    // Debounce search
    this.searchSubject.pipe(debounceTime(400)).subscribe((term) => {
      this.filterValues.search = term;
      this.serverSearch(term);
    });

    // Local filter
    this.dataSource.filterPredicate = (data: Lead, filter: string): boolean => {
      const f = JSON.parse(filter);
      const text = (
        (data.name || '') + ' ' + (data.email || '') + ' ' +
        (data.phone1 || '') + ' ' + (data.phone2 || '') +
        ' ' + (data.team || '') + ' ' + (data.status || '')
      ).toLowerCase();

      const teamMatch = f.team !== 'All Teams' ? data.team === f.team : true;
      const statusMatch = f.status !== 'All Statuses' ? data.status === f.status : true;
      return text.includes((f.search || '').toLowerCase()) && teamMatch && statusMatch;
    };
  }

  /** Load leads (supports array or { total, items }) */
  loadLeads(stopLoaderAfterLoad: boolean = true): void {
    this.loading = true;
    this.http.get<any>(`${environment.apiBaseUrl}/Clients/Get-uploaded-clients`).subscribe({
      next: (res) => {
        // Support response shapes: array, or { total, items }
        const items = Array.isArray(res) ? res : (res?.items ?? res?.data ?? []);
        const totalFromRes = typeof res?.total === 'number' ? res.total : (Array.isArray(res) ? res.length : (items?.length ?? 0));
        this.total = totalFromRes ?? (items?.length ?? 0);

        this.dataSource.data = (items ?? []).map((item: any) => ({
          name: item.name ?? '',
          email: item.email ?? '',
          phone1: item.contact ?? item.phone ?? '',
          phone2: item.contact2 ?? item.phone2 ?? '',
          status: item.status ?? 'N/A',
          team: item.team ?? 'UNASSIGNED'
        }));
        this.applyFilter();

        if (stopLoaderAfterLoad) this.loading = false;
        this.showBanner('✅ Latest leads loaded successfully!');
      },
      error: (err) => {
        this.loading = false;
        console.error('Failed to load leads', err);
        this.showBanner('❌ Failed to load leads', true);
      }
    });
  }

  /** Server-side search */
  serverSearch(query: string): void {
    const trimmed = query?.trim() || '';
    if (!trimmed) {
      this.loadLeads();
      return;
    }

    this.loading = true;

    const body = { searchText: trimmed }; // send this in GET body

    // Manually create GET request with body
    const req = new HttpRequest(
      'GET',
      `${environment.apiBaseUrl}/Clients/SearchByLetters`,
      body,
      { responseType: 'json' }
    );

    this.http.request<any>(req).subscribe({
      next: (event: any) => {
        // filter only successful response bodies
        if (!event || !event.body) return;

        const res = event.body;
        const items = Array.isArray(res) ? res : (res?.items ?? res?.data ?? []);
        this.total = typeof res?.total === 'number' ? res.total : (Array.isArray(res) ? res.length : items.length);

        if (!items || items.length === 0) {
          this.dataSource.data = [];
          this.loading = false;
          this.showBanner('⚠️ No matching leads found');
          return;
        }

        // Map API fields
        this.dataSource.data = (items ?? []).map((item: any) => ({
          name: item.name || '',
          email: item.email || '',
          phone1: item.contact || item.phone || '',
          phone2: item.contact2 || item.phone2 || '',
          status: item.status || 'N/A',
          team: item.team || 'UNASSIGNED'
        }));

        this.loading = false;
        this.showBanner(`🔍 Showing ${this.dataSource.data.length} search result${this.dataSource.data.length > 1 ? 's' : ''}`);
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Search failed:', err);
        this.showBanner('❌ Search failed', true);
      }
    });
  }

  /** Apply local filters */
  applyFilter(): void {
    this.dataSource.filter = JSON.stringify(this.filterValues);
    this.selection.clear();
  }

  /** Dropdowns */
  loadStatuses(): void {
    this.http.get<string[]>(`${environment.apiBaseUrl}/WorkFlow/GetStatus`).subscribe({
      next: (res) => (this.statuses = ['All Statuses', ...res]),
      error: (err) => console.error('Failed to load statuses', err)
    });
  }

  loadRoles(): void {
    this.http.get<string[]>(`${environment.apiBaseUrl}/WorkFlow/GetRoles`).subscribe({
      next: (res) => (this.teams = ['All Teams', ...res]),
      error: (err) => console.error('Failed to load roles/teams', err)
    });
  }

  /**
   * File upload + SheetJS parsing + mapping + fallback
   * - parsedForUpload: { name, email, contact, contact2, status, team } -> sent to backend
   * - previewData: Lead[] shown in table immediately for quick verification
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    // Quick file type guard
    const allowed = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ];
    if (!allowed.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      this.showBanner('❌ Unsupported file type', true);
      input.value = '';
      return;
    }

    this.loading = true;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const data = e.target?.result;
        // read workbook - prefer binary string
        const workbook = XLSX.read(data as string, { type: 'binary' });

        // use first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // convert to JSON, with raw values as arrays (header row detection easier)
        const raw: any[][] = XLSX.utils.sheet_to_json<any>(worksheet, { header: 1, defval: null });

        if (!raw || raw.length === 0) {
          this.loading = false;
          this.showBanner('⚠️ Empty spreadsheet', true);
          input.value = '';
          return;
        }

        // first row is headers (may be messy)
        const headerRow: any[] = raw[0].map((h: any) => (h === null ? '' : String(h).trim()));

        // remaining rows (filter out entirely blank rows)
        const rows: any[][] = raw.slice(1).filter(r => r && r.some((c: any) => c !== null && String(c).trim() !== ''));

        if (!rows.length) {
          this.loading = false;
          this.showBanner('⚠️ No data rows found', true);
          input.value = '';
          return;
        }

        // build mapping (field -> column index)
        const mapping = this.buildHeaderMapping(headerRow, rows);

        // build structured data arrays
        const parsedForUpload = rows.map(r => this.mapRowToUploadObject(r, headerRow, mapping)); // shape for backend
        const previewData: Lead[] = rows.map(r => this.mapRowToLead(r, headerRow, mapping)); // shape for table preview

        // log mapping and a sample so you can verify quickly
        console.log('Detected column mapping:', mapping);
        console.log('Parsed (upload) sample:', parsedForUpload.slice(0, 5));
        console.log('Preview sample:', previewData.slice(0, 5));

        // show preview immediately in UI so user can confirm mapping visually
        this.dataSource.data = previewData;
        this.total = previewData.length;
        this.applyFilter();

        // POST JSON to API that accepts parsed leads (create endpoint if missing)
        const importEndpoint = `${environment.apiBaseUrl}/Clients/ImportParsed`; // change if needed
        this.http.post<any>(importEndpoint, parsedForUpload).subscribe({
          next: (resp) => {
            // backend may return summary; if not use parsed length
            if (resp) {
              if (typeof resp?.total === 'number') this.total = resp.total;
              else if (Array.isArray(resp?.items)) this.total = resp.items.length;
              else this.total = parsedForUpload.length;
            } else {
              this.total = parsedForUpload.length;
            }

            this.showBanner('✅ File parsed and uploaded successfully!');
            this.loadLeads();
            this.loading = false;
          },
          error: (err) => {
            console.warn('Import JSON failed, falling back to file upload', err);
            // fallback: send original file to existing endpoint
            const form = new FormData();
            form.append('file', file, file.name);
            this.http.post<any>(`${environment.apiBaseUrl}/Clients/upload-excel`, form).subscribe({
              next: (resp2) => {
                if (resp2) {
                  if (typeof resp2?.total === 'number') this.total = resp2.total;
                  else if (Array.isArray(resp2?.items)) this.total = resp2.items.length;
                }
                this.showBanner('✅ File uploaded (fallback). Fetching latest leads...');
                this.loadLeads(true);
                this.loading = false;
              },
              error: (err2) => {
                this.loading = false;
                console.error('Upload fallback failed', err2);
                this.showBanner('❌ Upload failed', true);
              }
            });
          }
        });

      } catch (err) {
        console.error('Parse error', err);
        this.showBanner('❌ Failed to parse file', true);
        this.loading = false;
      } finally {
        input.value = '';
      }
    };

    // read as binary string for XLSX
    reader.readAsBinaryString(file);
  }

  /**
   * Build a mapping (field -> column index) using headers and sampling rows.
   * Returns mapping for: name, email, contact, contact2, status, team
   */
  private buildHeaderMapping(headers: any[], sampleRows: any[][]): Record<string, number | null> {
    const mapping: Record<string, number | null> = {
      name: null,
      email: null,
      contact: null,
      contact2: null,
      status: null,
      team: null
    };

    const normalized = headers.map(h => this.normalizeHeader(h || ''));

    // 1) Try header alias match
    for (let c = 0; c < normalized.length; c++) {
      const h = normalized[c];
      if (!h) continue;
      for (const target of Object.keys(this.headerAliases)) {
        for (const alias of this.headerAliases[target]) {
          if (h.includes(alias)) {
            if (mapping[target] === null) mapping[target] = c;
          }
        }
      }
    }

    // 2) For unmapped targets, try inference by sampling column values
    for (const target of Object.keys(mapping)) {
      if (mapping[target] !== null) continue;
      let bestCol: number | null = null;

      for (let c = 0; c < headers.length; c++) {
        // skip columns already claimed
        if (Object.values(mapping).includes(c)) continue;

        const samples: string[] = [];
        for (let r = 0; r < Math.min(10, sampleRows.length); r++) {
          const v = sampleRows[r][c];
          if (v !== null && v !== undefined && String(v).trim() !== '') samples.push(String(v).trim());
        }
        if (samples.length === 0) continue;

        if (target === 'email') {
          const matchCount = samples.filter(s => this.emailRegex.test(s)).length;
          if (matchCount / samples.length >= 0.6) bestCol = c;
        } else if (target === 'contact' || target === 'contact2') {
          const matchCount = samples.filter(s => this.phoneRegex.test(s)).length;
          if (matchCount / samples.length >= 0.6) {
            bestCol = c;
          }
        } else if (target === 'name') {
          const nonEmailNonPhone = samples.filter(s => !this.emailRegex.test(s) && !this.phoneRegex.test(s));
          if (nonEmailNonPhone.length / samples.length >= 0.6) bestCol = c;
        } else if (target === 'status' || target === 'team') {
          const nonEmpty = samples.filter(s => s && s.length > 0).length;
          if (nonEmpty / samples.length >= 0.6) bestCol = c;
        }

        if (bestCol !== null) break;
      }

      if (bestCol !== null) mapping[target] = bestCol;
    }

    // 3) Final fallback: assign remaining targets to available columns in order
    const unassignedTargets = Object.keys(mapping).filter(t => mapping[t] === null);
    const availableCols = headers.map((_, i) => i).filter(i => !Object.values(mapping).includes(i));
    for (let i = 0; i < unassignedTargets.length && i < availableCols.length; i++) {
      mapping[unassignedTargets[i]] = availableCols[i];
    }

    return mapping;
  }

  /** Normalize header value to a lowercase single-space phrase */
  private normalizeHeader(h: string): string {
    if (!h) return '';
    return h
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /** Map a sheet row (array) into standard Lead object (for preview) using mapping */
  private mapRowToLead(row: any[], headerRow: any[], mapping: Record<string, number | null>): Lead {
    const read = (col: number | null) => (col === null ? null : (row[col] ?? null));

    const name = read(mapping['name']) ?? '';
    const email = read(mapping['email']) ?? '';
    const contact = read(mapping['contact']) ?? '';
    const contact2 = read(mapping['contact2']) ?? '';
    const status = read(mapping['status']) ?? 'N/A';
    const team = read(mapping['team']) ?? 'UNASSIGNED';

    return {
      name: String(name ?? '').trim(),
      email: String(email ?? '').trim(),
      phone1: String(contact ?? '').trim(),
      phone2: String(contact2 ?? '').trim(),
      status: String(status ?? '').trim(),
      team: String(team ?? '').trim()
    };
  }

  /** Map a sheet row (array) into object shape expected by backend for upload */
  private mapRowToUploadObject(row: any[], headerRow: any[], mapping: Record<string, number | null>) {
    const read = (col: number | null) => (col === null ? null : (row[col] ?? null));
    const name = read(mapping['name']) ?? '';
    const email = read(mapping['email']) ?? '';
    const contact = read(mapping['contact']) ?? '';
    const contact2 = read(mapping['contact2']) ?? '';
    const status = read(mapping['status']) ?? 'N/A';
    const team = read(mapping['team']) ?? 'UNASSIGNED';

    return {
      name: String(name ?? '').trim(),
      email: String(email ?? '').trim(),
      contact: String(contact ?? '').trim(),
      contact2: String(contact2 ?? '').trim(),
      status: String(status ?? '').trim(),
      team: String(team ?? '').trim()
    };
  }

  /** Selection helpers */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numRows > 0 && numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.filteredData.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: Lead): string {
    if (!row) return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.name}`;
  }

  /** Row Actions */
  edit(row: Lead) {
    console.log('Edit', row);
    this.showBanner(`✏️ Edit ${row.name}`);
  }

  assign(row: Lead) {
    console.log('Assign', row);
    this.showBanner(`👤 Assigned ${row.name}`);
  }

  remove(row: Lead) {
    console.log('Delete', row);
    this.showBanner(`🗑️ Removed ${row.name}`);
  }

  /** Snackbar Banner Utility */
  private showBanner(message: string, isError: boolean = false): void {
    this.snackBar.open(message, 'OK', {
      duration: 3500,
      panelClass: isError ? ['banner-error'] : ['banner-success'],
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
}
