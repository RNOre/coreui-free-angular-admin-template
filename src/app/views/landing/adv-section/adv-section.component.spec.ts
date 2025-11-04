import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvSectionComponent } from './adv-section.component';

describe('AdvSectionComponent', () => {
  let component: AdvSectionComponent;
  let fixture: ComponentFixture<AdvSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
