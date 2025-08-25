import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstAppearanceComponent } from './first-appearance.component';

describe('FirstAppearanceComponent', () => {
  let component: FirstAppearanceComponent;
  let fixture: ComponentFixture<FirstAppearanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstAppearanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FirstAppearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
