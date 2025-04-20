import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalysisWidgetComponent } from './analysis-widget.component';

describe('AnalysisWidgetComponent', () => {
  let component: AnalysisWidgetComponent;
  let fixture: ComponentFixture<AnalysisWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalysisWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
