import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteLegalComponent } from './invite-legal.component';

describe('InviteLegalComponent', () => {
  let component: InviteLegalComponent;
  let fixture: ComponentFixture<InviteLegalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteLegalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteLegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
