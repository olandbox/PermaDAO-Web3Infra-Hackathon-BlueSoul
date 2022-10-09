import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutBoardComponent } from './logout-board.component';

describe('LogoutBoardComponent', () => {
  let component: LogoutBoardComponent;
  let fixture: ComponentFixture<LogoutBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogoutBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
