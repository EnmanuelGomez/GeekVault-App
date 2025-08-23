import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnemiesRivalsComponent } from './enemies-rivals.component';

describe('EnemiesRivalsComponent', () => {
  let component: EnemiesRivalsComponent;
  let fixture: ComponentFixture<EnemiesRivalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnemiesRivalsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnemiesRivalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
