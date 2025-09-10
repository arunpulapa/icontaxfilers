import { TestBed } from '@angular/core/testing';

import { DashboardServiceTsService } from './dashboard.service.ts.service';

describe('DashboardServiceTsService', () => {
  let service: DashboardServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
