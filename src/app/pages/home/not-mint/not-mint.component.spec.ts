import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotMintComponent } from './not-mint.component';

describe('NotMintComponent', () => {
  let component: NotMintComponent;
  let fixture: ComponentFixture<NotMintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotMintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotMintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
