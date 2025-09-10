import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Client } from '../../../core/models/client.model';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private clients: Client[] = [
    {
      id: '1',
      name: 'Ravi Kumar',
      email: 'ravi@test.com',
      phone: '9876543210',
      status: 'active',
      createdAt: new Date(),
      team: 'Tax Filing'
    },
    {
      id: '2',
      name: 'Anita Sharma',
      email: 'anita@test.com',
      status: 'inactive',
      createdAt: new Date(),
      team: 'Audit'
    }
  ];

  private clients$ = new BehaviorSubject<Client[]>(this.clients);

  getClients(): Observable<Client[]> {
    return this.clients$.asObservable();
  }

  getClient(id: string): Observable<Client | undefined> {
    return of(this.clients.find(c => c.id === id));
  }

  addClient(client: Client): void {
    this.clients.push({ ...client, id: Date.now().toString(), createdAt: new Date() });
    this.clients$.next(this.clients);
  }

  updateClient(updated: Client): void {
    const idx = this.clients.findIndex(c => c.id === updated.id);
    if (idx > -1) {
      this.clients[idx] = updated;
      this.clients$.next(this.clients);
    }
  }

  deleteClient(id: string): void {
    this.clients = this.clients.filter(c => c.id !== id);
    this.clients$.next(this.clients);
  }
}
