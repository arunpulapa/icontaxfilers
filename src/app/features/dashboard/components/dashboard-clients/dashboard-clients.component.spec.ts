import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardClientsComponent } from './dashboard-clients.component';

describe('DashboardClientsComponent', () => {
  let component: DashboardClientsComponent;
  let fixture: ComponentFixture<DashboardClientsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardClientsComponent]
    });
    fixture = TestBed.createComponent(DashboardClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
