import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DolistComponent } from './dolist.component';

describe('DolistComponent', () => {
  let component: DolistComponent;
  let fixture: ComponentFixture<DolistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DolistComponent]
    });
    fixture = TestBed.createComponent(DolistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
