import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginBoardComponent } from './login-board.component';

describe('LoginBoardComponent', () => {
  let component: LoginBoardComponent;
  let fixture: ComponentFixture<LoginBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
