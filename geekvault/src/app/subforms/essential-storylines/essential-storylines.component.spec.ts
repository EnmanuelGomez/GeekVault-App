import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EssentialStorylinesComponent } from './essential-storylines.component';

describe('EssentialStorylinesComponent', () => {
  let component: EssentialStorylinesComponent;
  let fixture: ComponentFixture<EssentialStorylinesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EssentialStorylinesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EssentialStorylinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
