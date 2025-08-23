import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowersAbilitiesComponent } from './powers-abilities.component';

describe('PowersAbilitiesComponent', () => {
  let component: PowersAbilitiesComponent;
  let fixture: ComponentFixture<PowersAbilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PowersAbilitiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PowersAbilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
