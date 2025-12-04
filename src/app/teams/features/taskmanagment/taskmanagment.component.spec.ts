import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskmanagmentComponent } from './taskmanagment.component';

describe('TaskmanagmentComponent', () => {
  let component: TaskmanagmentComponent;
  let fixture: ComponentFixture<TaskmanagmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskmanagmentComponent]
    });
    fixture = TestBed.createComponent(TaskmanagmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
