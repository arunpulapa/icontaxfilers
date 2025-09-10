import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamKraComponent } from './team-kra.component';

describe('TeamKraComponent', () => {
  let component: TeamKraComponent;
  let fixture: ComponentFixture<TeamKraComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamKraComponent]
    });
    fixture = TestBed.createComponent(TeamKraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
