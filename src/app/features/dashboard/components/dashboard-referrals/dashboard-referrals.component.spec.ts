import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardReferralsComponent } from './dashboard-referrals.component';

describe('DashboardReferralsComponent', () => {
  let component: DashboardReferralsComponent;
  let fixture: ComponentFixture<DashboardReferralsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardReferralsComponent]
    });
    fixture = TestBed.createComponent(DashboardReferralsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
