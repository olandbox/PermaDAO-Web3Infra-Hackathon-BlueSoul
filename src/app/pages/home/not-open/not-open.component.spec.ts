import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotOpenComponent } from './not-open.component';

describe('NotOpenComponent', () => {
  let component: NotOpenComponent;
  let fixture: ComponentFixture<NotOpenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotOpenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotOpenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
