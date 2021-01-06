import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceHindiComponent } from './invoice-hindi.component';

describe('InvoiceHindiComponent', () => {
  let component: InvoiceHindiComponent;
  let fixture: ComponentFixture<InvoiceHindiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoiceHindiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceHindiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
