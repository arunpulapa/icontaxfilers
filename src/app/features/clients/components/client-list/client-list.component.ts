import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Client } from 'src/app/core/models/client.model';
import { ClientService } from '../../services/client.service';


@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent {
displayedColumns: string[] = ['name', 'email', 'status', 'team', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<Client>([]);
  searchTerm: string = '';

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getClients().subscribe(clients => {
      this.dataSource.data = clients;
    });
  }

  applyFilter() {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
  }

  deleteClient(id: string) {
    this.clientService.deleteClient(id);
    this.loadClients();
  }
}
