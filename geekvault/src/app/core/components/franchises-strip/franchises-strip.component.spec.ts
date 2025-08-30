import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FranchisesStripComponent } from './franchises-strip.component';

describe('FranchisesStripComponent', () => {
  let component: FranchisesStripComponent;
  let fixture: ComponentFixture<FranchisesStripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FranchisesStripComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FranchisesStripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
