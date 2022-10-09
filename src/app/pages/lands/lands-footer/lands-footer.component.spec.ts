import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandsFooterComponent } from './lands-footer.component';

describe('LandsFooterComponent', () => {
  let component: LandsFooterComponent;
  let fixture: ComponentFixture<LandsFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandsFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandsFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
