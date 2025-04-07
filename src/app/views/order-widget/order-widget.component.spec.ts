import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderWidgetComponent } from './order-widget.component';

describe('OrderWidgetComponent', () => {
  let component: OrderWidgetComponent;
  let fixture: ComponentFixture<OrderWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
