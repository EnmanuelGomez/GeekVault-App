import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdaptationsComponent } from './adaptations.component';

describe('AdaptationsComponent', () => {
  let component: AdaptationsComponent;
  let fixture: ComponentFixture<AdaptationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdaptationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdaptationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
