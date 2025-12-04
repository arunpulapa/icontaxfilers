import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedleadsComponent } from './assignedleads.component';

describe('AssignedleadsComponent', () => {
  let component: AssignedleadsComponent;
  let fixture: ComponentFixture<AssignedleadsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignedleadsComponent]
    });
    fixture = TestBed.createComponent(AssignedleadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
