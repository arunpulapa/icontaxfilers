import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { ClientService } from '../../services/client.service'; // adjust path if needed

// shape of a document row in the table
export interface MyDocument {
  id?: string;
  fileName: string;
  clientName: string;
  type: string;
  status: string;
  uploadedBy: string;
  uploadedAt: string; // ISO date
}

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {

  // ---- stats row ----
  stats = {
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0
  };

  // ---- filters ----
  filters = {
    search: '',
    type: '',
    status: ''
  };

  documentTypes: string[] = ['All Types']; // fill from API later if needed

  // ---- table ----
  displayedColumns: string[] = [
    'document',
    'client',
    'type',
    'status',
    'uploadedBy',
    'uploadDate',
    'actions'
  ];

  dataSource = new MatTableDataSource<MyDocument>([]);

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadDocumentCounts();
    this.loadDocuments(); // for now just dummy data
  }

  // helper: convert API response to number
  private asNumber(value: any): number {
    if (value == null) return 0;
    if (typeof value === 'number') return value;
    if (typeof value === 'object') {
      return value.count ?? value.total ?? value.data ?? 0;
    }
    const n = Number(value);
    return isNaN(n) ? 0 : n;
  }

  // ---- counts from Dashboard APIs ----
  private loadDocumentCounts(): void {
    forkJoin({
      verified: this.clientService.getVerifiedDocumentsCount(),
      pending: this.clientService.getPendingDocumentsCount(),
      rejected: this.clientService.getRejectedDocumentsCount()
    }).subscribe({
      next: ({ verified, pending, rejected }) => {
        this.stats.verified = this.asNumber(verified);
        this.stats.pending  = this.asNumber(pending);
        this.stats.rejected = this.asNumber(rejected);
        this.stats.total    = this.stats.verified + this.stats.pending + this.stats.rejected;
      },
      error: (err) => {
        console.error('Failed to load document counts', err);
      }
    });
  }

  // ---- placeholder: load table data (later replace with real API) ----
  private loadDocuments(): void {
    // TODO: replace with real API call when you have endpoint
    const demo: MyDocument[] = [];
    this.dataSource.data = demo;
  }

  // filter buttons
  applyFilters(): void {
    // when you have a real API, call it here with filters
    // for now, just local filter on filename/status/type
    this.dataSource.filterPredicate = (data: MyDocument, filter: string) => {
      const f = JSON.parse(filter);
      const search = (f.search || '').toLowerCase();
      const matchesSearch =
        !search ||
        data.fileName.toLowerCase().includes(search) ||
        data.clientName.toLowerCase().includes(search);

      const matchesType = f.type ? data.type === f.type : true;
      const matchesStatus = f.status ? data.status === f.status : true;
      return matchesSearch && matchesType && matchesStatus;
    };

    this.dataSource.filter = JSON.stringify(this.filters);
  }

  clearFilters(): void {
    this.filters = { search: '', type: '', status: '' };
    this.dataSource.filter = ''; // resets local filter
  }

  onUpload(): void {
  // TODO: open upload dialog or navigate
  console.log('Upload clicked');
}

onRefresh(): void {
  this.loadDocumentCounts();
  this.loadDocuments();
}

}
