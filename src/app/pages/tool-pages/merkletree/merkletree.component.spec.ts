import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerkletreeComponent } from './merkletree.component';

describe('MerkletreeComponent', () => {
  let component: MerkletreeComponent;
  let fixture: ComponentFixture<MerkletreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerkletreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MerkletreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
