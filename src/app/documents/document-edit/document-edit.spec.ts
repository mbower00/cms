import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentEdit } from './document-edit';

describe('DocumentEdit', () => {
  let component: DocumentEdit;
  let fixture: ComponentFixture<DocumentEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
