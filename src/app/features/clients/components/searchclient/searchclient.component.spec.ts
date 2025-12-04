import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchclientComponent } from './searchclient.component';

describe('SearchclientComponent', () => {
  let component: SearchclientComponent;
  let fixture: ComponentFixture<SearchclientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchclientComponent]
    });
    fixture = TestBed.createComponent(SearchclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
