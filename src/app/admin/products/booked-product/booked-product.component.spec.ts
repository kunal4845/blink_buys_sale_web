import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookedProductComponent } from './booked-product.component';

describe('BookedProductComponent', () => {
  let component: BookedProductComponent;
  let fixture: ComponentFixture<BookedProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookedProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookedProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
