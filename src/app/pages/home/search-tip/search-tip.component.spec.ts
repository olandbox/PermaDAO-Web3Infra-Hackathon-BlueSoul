import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTipComponent } from './search-tip.component';

describe('SearchTipComponent', () => {
  let component: SearchTipComponent;
  let fixture: ComponentFixture<SearchTipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchTipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchTipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
