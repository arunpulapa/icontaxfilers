import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientSelectionService {
  private clientIdSubject = new BehaviorSubject<string | null>(null);
  clientId$ = this.clientIdSubject.asObservable();

  setClientId(id: string) {
    this.clientIdSubject.next(id);
  }

  getClientId(): string | null {
    return this.clientIdSubject.getValue();
  }
}
