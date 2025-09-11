import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowersAbilitiesSubformComponent } from './powers-abilities.component';

describe('PowersAbilitiesComponent', () => {
  let component: PowersAbilitiesSubformComponent;
  let fixture: ComponentFixture<PowersAbilitiesSubformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PowersAbilitiesSubformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PowersAbilitiesSubformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
