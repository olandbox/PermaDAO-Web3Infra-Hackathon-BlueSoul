import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MintedComponent } from './minted.component';

describe('MintedComponent', () => {
  let component: MintedComponent;
  let fixture: ComponentFixture<MintedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MintedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MintedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
