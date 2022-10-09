import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThumbSimpleComponent } from './thumb-simple.component';

describe('ThumbSimpleComponent', () => {
  let component: ThumbSimpleComponent;
  let fixture: ComponentFixture<ThumbSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThumbSimpleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThumbSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
