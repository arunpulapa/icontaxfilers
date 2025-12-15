import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { AuthService } from 'src/app/auth/auth.service';
import { ClientSelectionService } from '../clients/services/client-selection.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

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
export class DocumentsComponent implements OnInit, OnChanges, OnDestroy {
  // Admin can type or pass this in – GUID as string
  @Input() clientId: string = '';
  @Input() clientName?: string;

  private api = environment.apiBaseUrl;

  documentTypes: string[] = [];
  documentType = '';

  selectedFiles: File[] = [];
  isDragOver = false;
  uploading = false;

  documents: ClientDocument[] = [];
  filteredDocuments: ClientDocument[] = [];
  displayedColumns = ['fileName', 'documentType', 'uploadedAt', 'actions'];
  search = '';

  private subs: Subscription[] = [];
  private hasLoadedOnceForCurrentId = false; // prevent duplicate loadDocuments() calls on init

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private clientSelectionService: ClientSelectionService,
    private route: ActivatedRoute
  ) {
    console.log('[DocumentsComponent] constructor, default clientId =', this.clientId);
  }

  private authOptions(removeContentType: boolean = false) {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    // When sending FormData → remove Content-Type
    if (removeContentType) {
      headers = headers.delete('Content-Type');
    }

    return { headers };
  }

  ngOnInit(): void {
    // 1) Subscribe to selection service
    const s1 = this.clientSelectionService.clientId$.subscribe(id => {
      console.log('[DocumentsComponent] clientSelection emitted id =', id);
      if (id && id !== this.clientId) {
        this.clientId = id;
        this.hasLoadedOnceForCurrentId = false;
        this.loadDocuments();
      }
    });
    this.subs.push(s1);

    // 2) Query param snapshot (deep-link) and subscription
    const snapshotId = this.route.snapshot.queryParamMap.get('clientId');
    if (snapshotId) {
      console.log('[DocumentsComponent] queryParam snapshot clientId =', snapshotId);
      // prefer the query param if present (it may be a deep-link)
      this.clientId = snapshotId;
      this.hasLoadedOnceForCurrentId = false;
      this.loadDocuments();
    }

    const s2 = this.route.queryParamMap.subscribe(qm => {
      const id = qm.get('clientId');
      if (id) {
        console.log('[DocumentsComponent] queryParamMap emitted clientId =', id);
        if (id !== this.clientId) {
          this.clientId = id;
          this.hasLoadedOnceForCurrentId = false;
          this.loadDocuments();
        }
      }
    });
    this.subs.push(s2);

    // 3) Load document types (independent)
    this.loadDocumentTypes();

    // If clientId was passed as @Input before ngOnInit, ensure we call loadDocuments once
    if (this.clientId && !snapshotId) {
      console.log('[DocumentsComponent] ngOnInit detected initial @Input clientId =', this.clientId);
      this.hasLoadedOnceForCurrentId = false;
      this.loadDocuments();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['clientId']) {
      console.log('[DocumentsComponent] ngOnChanges clientId changed to:', this.clientId);
      this.hasLoadedOnceForCurrentId = false;
      this.loadDocuments();
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    this.subs = [];
  }

  /* ---------- Load document types ---------- */
  private loadDocumentTypes(): void {
    const url = `${this.api}/WorkFlow/GetTypes`;
    console.log('[DocumentsComponent] loadDocumentTypes → GET', url);

    this.http.get<{ type: string }[]>(url).subscribe({
      next: (res) => {
        this.documentTypes = (res || []).map((x) => x.type);
        console.log('[DocumentsComponent] documentTypes =', this.documentTypes);
      },
      error: (err) => {
        console.error('[DocumentsComponent] loadDocumentTypes ERROR', err);
        this.documentTypes = ['All Documents (ZIP File)'];
      },
    });
  }

  /* ---------- Load existing docs ---------- */
  loadDocuments(): void {
    console.log('[DocumentsComponent] loadDocuments() called with clientId =', this.clientId);

    if (!this.clientId) {
      this.filteredDocuments = this.documents = [];
      return;
    }

    // simple guard to avoid duplicate identical calls in quick succession
    if (this.hasLoadedOnceForCurrentId) {
      console.log('[DocumentsComponent] loadDocuments: already loaded for this clientId, skipping duplicate call');
      return;
    }
    this.hasLoadedOnceForCurrentId = true;

    const url = `${this.api}/clients/${this.clientId}/documents`;
    console.log('[DocumentsComponent] loadDocuments → GET', url);

    this.http.get<ClientDocument[]>(url, this.authOptions()).subscribe({
      next: (docs) => {
        this.documents = docs || [];
        this.applyFilter();
        console.log('[DocumentsComponent] received documents count =', this.documents.length);
      },
      error: (err) => {
        console.error('[DocumentsComponent] loadDocument ERROR', err);
        this.documents = this.filteredDocuments = [];
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
    if (list.length) this.selectedFiles = [...this.selectedFiles, ...list];
  }

  onDragOver(e: DragEvent) {
    e.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(e: DragEvent) {
    e.preventDefault();
    this.isDragOver = false;
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.isDragOver = false;
    if (e.dataTransfer?.files?.length) {
      const list = Array.from(e.dataTransfer.files);
      this.selectedFiles = [...this.selectedFiles, ...list];
    }
  }

  clearSelected() {
    this.selectedFiles = [];
  }

  removeSelected(i: number) {
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

    if (!this.clientId) {
      alert('Please enter/select a Client ID (GUID).');
      return;
    }
    if (!this.selectedFiles.length) {
      alert('Please select at least one file.');
      return;
    }
    if (!this.documentType) {
      alert('Please choose a document type.');
      return;
    }

    const formData = new FormData();
    this.selectedFiles.forEach(file => formData.append('files', file, file.name));
    formData.append('documentType', this.documentType);
    formData.append('clientId', this.clientId);

    const url = `${this.api}/clients/${this.clientId}/documents`;
    console.log('[DocumentsComponent] POST', url);

    this.uploading = true;

    this.http.post(url, formData, this.authOptions(true)).subscribe({
      next: () => {
        this.uploading = false;
        this.selectedFiles = [];
        this.documentType = '';
        // make sure we allow reload next time
        this.hasLoadedOnceForCurrentId = false;
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
      error: (err) => {
        console.error('[DocumentsComponent] download ERROR', err);
      }
    });
  }

  /* ---------- Delete ---------- */
  delete(doc: ClientDocument): void {
    if (!confirm(`Delete document "${doc.fileName}"?`)) return;

    const url = `${this.api}/clients/${this.clientId}/documents/${doc.id}`;

    this.http.delete(url).subscribe({
      next: () => {
        this.hasLoadedOnceForCurrentId = false;
        this.loadDocuments();
      },
      error: (err) => console.error('[DocumentsComponent] delete ERROR', err),
    });
  }
}
