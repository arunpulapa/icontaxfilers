import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { AuthService, User } from 'src/app/auth/auth.service';

interface ClientDocument {
  id: number;
  fileName: string;
  documentType: string;
  uploadedAt: string;
}

@Component({
  selector: 'app-client-documents',
  templateUrl: './client-documents.component.html',
  styleUrls: ['./client-documents.component.scss']
})
export class ClientDocumentsComponent implements OnInit {

  clientId: string = '59';           // auto-filled
  clientName: string = '';         // auto-filled

  private api = environment.apiBaseUrl;

  documentTypes: string[] = [];
  documentType = '';

  selectedFiles: File[] = [];
  isDragOver = false;
  uploading = false;

  documents: ClientDocument[] = [];
  filteredDocuments: ClientDocument[] = [];
  search = '';

  constructor(private http: HttpClient, private authService: AuthService) {}

  /** Attach Authorization header */
  private authOptions(removeContentType = false) {
    const token = this.authService.getToken();
    let headers = new HttpHeaders();

    if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    if (removeContentType) headers = headers.delete('Content-Type');

    return { headers };
  }

  ngOnInit(): void {
    // 🔹 Load user from AuthService (localStorage)
    const user: User | null = this.authService.getUser();

    if (user) {
      this.clientId = String(user.id); // user.id → backend ID
      this.clientName = user.firstName + ' ' + user.lastName;
    }

    console.log("Client ID auto-detected:", this.clientId);

    this.loadDocumentTypes();
    this.loadDocuments();
  }

  /** LOAD DOCUMENT TYPE LIST */
  private loadDocumentTypes() {
    const url = `${this.api}/WorkFlow/GetTypes`;

    this.http.get<{ type: string }[]>(url, this.authOptions()).subscribe({
      next: res => (this.documentTypes = res.map(x => x.type)),
      error: err => console.error("Load types error:", err)
    });
  }

  /** LOAD EXISTING DOCUMENTS */
 loadDocuments(): void {
  const fixedClientId = '59'; // 🔥 ALWAYS FORCE 57

  const url = `${this.api}/clients/${fixedClientId}/documents`;

  console.log('[DocumentsComponent] loadDocuments → GET', url);

  this.http.get<ClientDocument[]>(url, this.authOptions()).subscribe({
    next: (docs) => {
      this.documents = docs || [];
      this.applyFilter();
    },
    error: (err) => {
      console.error('[DocumentsComponent] loadDocuments ERROR', err);
      this.documents = this.filteredDocuments = [];
    },
  });
}


  /** SEARCH FILTER */
  applyFilter() {
    const term = this.search.toLowerCase();

    this.filteredDocuments = !term
      ? this.documents
      : this.documents.filter(
          d =>
            d.fileName.toLowerCase().includes(term) ||
            d.documentType.toLowerCase().includes(term)
        );
  }

  /** FILE INPUT & DRAG/DROP */
 onFilesSelected(event: Event): void {
  const target = event.target as HTMLInputElement;
  const files = target.files ? Array.from(target.files) as File[] : [];
  this.selectedFiles = [...this.selectedFiles, ...files];
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
    const list = Array.from(e.dataTransfer.files) as File[];
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

  /** UPLOAD DOCUMENTS */
upload(): void {
  console.log('[DocumentsComponent] upload()', {
    clientId: this.clientId,
    documentType: this.documentType,
    files: this.selectedFiles.length
  });

  if (!this.selectedFiles.length) {
    alert('Please select at least one file.');
    return;
  }
  if (!this.documentType) {
    alert('Please choose a document type.');
    return;
  }

  const fixedClientId = '57';   // 🔥 ALWAYS FORCE 57  
  const formData = new FormData();

  this.selectedFiles.forEach(file =>
    formData.append('files', file, file.name)
  );

  formData.append('documentType', this.documentType);
  formData.append('clientId', fixedClientId);

  const url = `${this.api}/clients/${fixedClientId}/documents`; // 🔥 Always 57

  console.log('[DocumentsComponent] POST', url);

  this.uploading = true;

  this.http.post(url, formData, this.authOptions(true)).subscribe({
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


  /** DOWNLOAD */
  download(doc: ClientDocument) {
    const url = `${this.api}/clients/${this.clientId}/documents/${doc.id}`;

    this.http.get(url, { responseType: 'blob', ...this.authOptions() }).subscribe(blob => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = doc.fileName;
      a.click();
    });
  }

  /** DELETE */
  delete(doc: ClientDocument) {
    if (!confirm(`Delete "${doc.fileName}"?`)) return;

    const url = `${this.api}/clients/${this.clientId}/documents/${doc.id}`;

    this.http.delete(url, this.authOptions()).subscribe({
      next: () => this.loadDocuments(),
      error: err => console.error("Delete error:", err)
    });
  }
}
