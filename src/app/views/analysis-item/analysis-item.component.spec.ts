import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisItemComponent } from './analysis-item.component';

describe('AnalysisItemComponent', () => {
  let component: AnalysisItemComponent;
  let fixture: ComponentFixture<AnalysisItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
