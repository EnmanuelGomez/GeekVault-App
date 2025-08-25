import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCharacterCategoryComponent } from './add-character-category.component';

describe('AddCharacterCategoryComponent', () => {
  let component: AddCharacterCategoryComponent;
  let fixture: ComponentFixture<AddCharacterCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCharacterCategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCharacterCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
