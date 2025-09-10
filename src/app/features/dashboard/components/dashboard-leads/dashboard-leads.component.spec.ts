import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLeadsComponent } from './dashboard-leads.component';

describe('DashboardLeadsComponent', () => {
  let component: DashboardLeadsComponent;
  let fixture: ComponentFixture<DashboardLeadsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardLeadsComponent]
    });
    fixture = TestBed.createComponent(DashboardLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
