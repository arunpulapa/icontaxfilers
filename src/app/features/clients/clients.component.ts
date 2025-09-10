import { Component } from '@angular/core';
import { ClientService } from './services/client.service';
import { Client } from '../../core/models/client.model';
@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm = '';
  cols: string[] = ['name', 'email', 'status', 'actions'];

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.clientService.getClients().subscribe(clients => {
      this.clients = clients;
      this.filteredClients = clients;
    });
  }

applyFilter() {
  const term = this.searchTerm.toLowerCase();
  this.filteredClients = this.clients.filter((c: any) =>
    `${c.name} ${c.email}`.toLowerCase().includes(term)
  );
}



  delete(id: string) {
    this.clientService.deleteClient(id);
  }
}
