import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';

interface ClientDocument {
  id: number;
  fileName: string;
  documentType: string;
  uploadedAt: string; // ISO date string
}

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
})
export class DocumentsComponent implements OnInit, OnChanges {
  // 👇 DEFAULT CLIENT ID = 10
  @Input() clientId: number = 10;
  @Input() clientName?: string;

  private api = environment.apiBaseUrl;

  documentTypes: string[] = ['W2', '1099', 'Passport', 'PAN', 'Others'];
  documentType = '';

  selectedFiles: File[] = [];
  isDragOver = false;
  uploading = false;

  documents: ClientDocument[] = [];
  filteredDocuments: ClientDocument[] = [];
  search = '';

  constructor(private http: HttpClient) {
    console.log(
      '[DocumentsComponent] constructor, default clientId =',
      this.clientId
    );
  }

  ngOnInit(): void {
    console.log('[DocumentsComponent] ngOnInit, clientId =', this.clientId);
    if (this.clientId) this.loadDocuments();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clientId']) {
      console.log('[DocumentsComponent] clientId changed to:', this.clientId);
      if (this.clientId) {
        this.loadDocuments();
      } else {
        this.documents = [];
        this.filteredDocuments = [];
      }
    }
  }

  /* ---------- Load existing docs ---------- */
  loadDocuments(): void {
    if (!this.clientId) return;

    const url = `${this.api}/clients/${this.clientId}/documents`;
    console.log('[DocumentsComponent] loadDocuments → GET', url);

    this.http.get<ClientDocument[]>(url).subscribe({
      next: (docs) => {
        this.documents = docs || [];
        this.applyFilter();
      },
      error: (err) => {
        console.error('[DocumentsComponent] loadDocuments ERROR', err);
        this.documents = [];
        this.filteredDocuments = [];
      },
    });
  }

  /* ---------- Search ---------- */
  applyFilter(): void {
    const term = (this.search || '').toLowerCase();

    if (!term) {
      this.filteredDocuments = this.documents;
      return;
    }

    this.filteredDocuments = this.documents.filter(
      (d) =>
        d.fileName.toLowerCase().includes(term) ||
        d.documentType.toLowerCase().includes(term)
    );
  }

  /* ---------- File Input + Drag/Drop ---------- */
  onFilesSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    const list = target.files ? Array.from(target.files) : [];
    if (list.length) {
      this.selectedFiles = [...this.selectedFiles, ...list];
    }
  }

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver = false;
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver = false;
    if (e.dataTransfer?.files?.length) {
      const list = Array.from(e.dataTransfer.files);
      this.selectedFiles = [...this.selectedFiles, ...list];
    }
  }

  clearSelected(): void {
    this.selectedFiles = [];
  }

  removeSelected(i: number): void {
    this.selectedFiles.splice(i, 1);
    this.selectedFiles = [...this.selectedFiles];
  }

  /* ---------- Upload ---------- */
  upload(): void {
    console.log('[DocumentsComponent] upload()', {
      clientId: this.clientId,
      documentType: this.documentType,
      files: this.selectedFiles.length,
    });

    if (!this.clientId || !this.selectedFiles.length || !this.documentType) {
      return;
    }

    const formData = new FormData();

    this.selectedFiles.forEach((file) =>
      formData.append('files', file, file.name)
    );

    formData.append('documentType', this.documentType);

    const url = `${this.api}/clients/${this.clientId}/documents`;
    console.log('[DocumentsComponent] POST', url);

    this.uploading = true;

    this.http.post(url, formData).subscribe({
      next: () => {
        this.uploading = false;
        this.selectedFiles = [];
        this.documentType = '';
        this.loadDocuments();
      },
      error: (err) => {
        this.uploading = false;
        console.error('[DocumentsComponent] upload ERROR', err);
      },
    });
  }

  /* ---------- Download ---------- */
  download(doc: ClientDocument): void {
    const url = `${this.api}/clients/${this.clientId}/documents/${doc.id}`;
    this.http.get(url, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = doc.fileName;
        a.click();
        URL.revokeObjectURL(downloadUrl);
      },
      error: (err) => console.error('[DocumentsComponent] download ERROR', err),
    });
  }

  /* ---------- Delete ---------- */
  delete(doc: ClientDocument): void {
    if (!confirm(`Delete document "${doc.fileName}"?`)) return;

    const url = `${this.api}/clients/${this.clientId}/documents/${doc.id}`;

    this.http.delete(url).subscribe({
      next: () => this.loadDocuments(),
      error: (err) => console.error('[DocumentsComponent] delete ERROR', err),
    });
  }
}
