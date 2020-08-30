import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerRequestComponent } from './dealer-request.component';

describe('DealerRequestComponent', () => {
  let component: DealerRequestComponent;
  let fixture: ComponentFixture<DealerRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealerRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
