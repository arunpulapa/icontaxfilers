import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamDocumentsUploadComponent } from './team-documents-upload.component';

describe('TeamDocumentsUploadComponent', () => {
  let component: TeamDocumentsUploadComponent;
  let fixture: ComponentFixture<TeamDocumentsUploadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamDocumentsUploadComponent]
    });
    fixture = TestBed.createComponent(TeamDocumentsUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
