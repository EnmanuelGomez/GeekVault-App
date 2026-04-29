import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionSubformComponent } from './versions.component';

describe('VersionsComponent', () => {
  let component: VersionSubformComponent;
  let fixture: ComponentFixture<VersionSubformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VersionSubformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VersionSubformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
