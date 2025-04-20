import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLegalComponent } from './user-legal.component';

describe('UserLegalComponent', () => {
  let component: UserLegalComponent;
  let fixture: ComponentFixture<UserLegalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserLegalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserLegalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
