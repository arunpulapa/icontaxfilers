import { TestBed } from '@angular/core/testing';

import { ClientSelectionService } from './client-selection.service';

describe('ClientSelectionService', () => {
  let service: ClientSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
