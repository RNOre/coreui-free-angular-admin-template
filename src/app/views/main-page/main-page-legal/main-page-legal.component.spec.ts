import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPageLegalComponent } from './main-page-legal.component';

describe('MainPageLegalComponent', () => {
  let component: MainPageLegalComponent;
  let fixture: ComponentFixture<MainPageLegalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainPageLegalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainPageLegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
