import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ClientService } from '../../services/client.service'; // adjust path if different
import { Client } from 'src/app/core/models/client.model';

@Component({
  selector: 'app-searchclient',
  templateUrl: './searchclient.component.html',
  styleUrls: ['./searchclient.component.scss']
})
export class SearchclientComponent implements OnInit, OnDestroy {
  searchForm = this.fb.group({
    searchText: ['', Validators.required],
    status: ['all']
  });

  isLoading = false;        // useful when you later connect real API
  errorMessage = '';

  /** all clients from service */
  private allClients: Client[] = [];
  /** filtered for display */
  clients: Client[] = [];

  displayedColumns: string[] = ['name', 'email', 'phone', 'status', 'team', 'createdAt', 'actions'];

  private sub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    // get initial list (from BehaviorSubject)
    this.sub = this.clientService.getClients().subscribe(clients => {
      this.allClients = clients || [];
      this.applyFilter();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  onSearch(): void {
    if (this.searchForm.invalid) return;
    this.applyFilter();
  }

  clear(): void {
    this.searchForm.reset({ searchText: '', status: 'all' });
    this.errorMessage = '';
    this.applyFilter();
  }

  private applyFilter(): void {
    const text = (this.searchForm.value.searchText || '').toLowerCase().trim();
    const status = this.searchForm.value.status || 'all';

    this.clients = this.allClients.filter(c => {
      const matchesText =
        !text ||
        c.name?.toLowerCase().includes(text) ||
        c.email?.toLowerCase().includes(text) ||
        c.phone?.toLowerCase().includes(text) ||
        c.id?.toString().toLowerCase().includes(text);

      const matchesStatus =
        status === 'all' || !c.status
          ? true
          : c.status.toLowerCase() === status.toLowerCase();

      return matchesText && matchesStatus;
    });
  }

  viewClient(c: Client): void {
    // later: navigate to /clients/:id or open details dialog
    console.log('view client', c);
  }
}
