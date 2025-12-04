import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyclientsComponent } from './myclients.component';

describe('MyclientsComponent', () => {
  let component: MyclientsComponent;
  let fixture: ComponentFixture<MyclientsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyclientsComponent]
    });
    fixture = TestBed.createComponent(MyclientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
