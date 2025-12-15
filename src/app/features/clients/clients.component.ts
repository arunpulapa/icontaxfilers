import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { ClientService } from './services/client.service';
import { Client } from 'src/app/core/models/client.model';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ClientSelectionService } from './services/client-selection.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('documentDialog') documentDialog!: TemplateRef<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private documentDialogRef?: MatDialogRef<any>;
  selectedClient: Client | null = null;

  // data + UI
  private allClients: Client[] = [];
  private filteredClients: Client[] = [];

  dataSource = new MatTableDataSource<Client>([]);
  searchTerm = '';
  // show relevant columns (team/role will show '-' if missing)
  cols: string[] = ['name', 'email', 'phone', 'status', 'team', 'documents', 'actions'];

  loading = false;
  hasError = false;

  // pagination
  pageIndex = 0;
  pageSize = 25;
  pageSizeOptions = [10, 25, 50];
  totalItems = 0;

  useServerSide = false;

  private destroy$ = new Subject<void>();

  constructor(
    private clientService: ClientService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private clientSelectionService: ClientSelectionService
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  ngAfterViewInit(): void {
    // manual paging/slicing approach in updatePagedData
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* ---------- Loading ---------- */
  loadClients(): void {
    this.loading = true;
    this.hasError = false;

    if (this.useServerSide) {
      this.loadPageFromServer(this.pageIndex, this.pageSize);
      return;
    }

    this.clientService.getClients()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (list: Client[]) => {
          // list is already normalized by the service
          this.allClients = (list || []).map(item => ({
            ...item,
            // ensure phone field present from contact fallback
            phone: item.phone ?? item.contact ?? null
          }));
          this.filteredClients = [...this.allClients];
          this.totalItems = this.filteredClients.length;
          this.pageIndex = 0;
          this.updatePagedData();
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load clients', err);
          this.loading = false;
          this.hasError = true;
          this.snackBar.open('❌ Failed to load clients', 'OK', { duration: 3000, panelClass: ['banner-error'] });
        }
      });
  }

  private loadPageFromServer(pageIndex: number, pageSize: number): void {
    this.loading = true;
    this.clientService.getClientsPaged(pageIndex + 1, pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp: { items: Client[]; total: number }) => {
          this.dataSource.data = resp.items || [];
          this.totalItems = resp.total ?? (resp.items || []).length;
          this.loading = false;
        },
        error: (err) => {
          console.error('Failed to load page from server', err);
          this.loading = false;
          this.hasError = true;
          this.snackBar.open('❌ Failed to load clients', 'OK', { duration: 3000, panelClass: ['banner-error'] });
        }
      });
  }

  private updatePagedData(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.dataSource.data = this.filteredClients.slice(start, end);
    this.totalItems = this.filteredClients.length;
  }

  onPageChanged(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;

    if (this.useServerSide) {
      this.loadPageFromServer(this.pageIndex, this.pageSize);
    } else {
      this.updatePagedData();
    }
  }

  private matchesFilter(item: Client, term: string): boolean {
    const t = term.trim().toLowerCase();
    if (!t) return true;
    const name = (item.name ?? '').toLowerCase();
    const email = (item.email ?? '').toLowerCase();
    const phone = (item.phone ?? item.contact ?? '').toLowerCase();
    const status = (item.status ?? '').toLowerCase();
    const team = (item.team ?? '').toLowerCase();

    return `${name} ${email} ${phone} ${status} ${team}`.includes(t);
  }

  applyFilter(): void {
    if (this.useServerSide) {
      this.pageIndex = 0;
      this.loadPageFromServer(this.pageIndex, this.pageSize);
      return;
    }

    const term = (this.searchTerm || '').trim().toLowerCase();
    this.filteredClients = this.allClients.filter(c => this.matchesFilter(c, term));
    this.totalItems = this.filteredClients.length;
    this.pageIndex = 0;
    if (this.paginator) this.paginator.firstPage();
    this.updatePagedData();
  }

  selectClient(row: Client): void {
    if (!row?.id) return;
    this.selectedClient = row;
    this.clientSelectionService.setClientId(String(row.id));
  }

  openDocumentDialog(client: Client): void {
    this.selectedClient = client;
    this.documentDialogRef = this.dialog.open(this.documentDialog, {
      width: '420px',
      data: { clientName: client.name || client.email || 'Client' },
      disableClose: true,
      panelClass: 'custom-document-dialog'
    });
  }

  closeDialog(): void {
    if (this.documentDialogRef) {
      this.documentDialogRef.close();
      this.documentDialogRef = undefined;
    }
  }

  goToDocuments(): void {
    if (!this.selectedClient?.id) {
      this.closeDialog();
      return;
    }

    const id = String(this.selectedClient.id);
    this.clientSelectionService.setClientId(id);

    if (this.documentDialogRef) this.documentDialogRef.close();
    this.router.navigate(['/admin', 'documents'], { queryParams: { clientId: id } }).catch(console.error);
  }

  delete(id?: string | number): void {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this client? This action cannot be undone.')) return;
    this.loading = true;
    this.clientService.deleteClient(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackBar.open('✅ Client deleted', 'OK', { duration: 3000, panelClass: ['banner-success'] });
          this.loadClients();
        },
        error: (err) => {
          console.error('Delete failed', err);
          this.loading = false;
          this.snackBar.open('❌ Failed to delete client', 'OK', { duration: 3000, panelClass: ['banner-error'] });
        }
      });
  }

  goToNewClient(): void {
    this.router.navigate(['/clients/new']);
  }

  trackById(_: number, item: Client) {
    return item.id;
  }
}
