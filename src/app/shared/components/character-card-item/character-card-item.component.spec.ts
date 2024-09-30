import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterCardItemComponent } from './character-card-item.component';

describe('CharacterCardItemComponent', () => {
  let component: CharacterCardItemComponent;
  let fixture: ComponentFixture<CharacterCardItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterCardItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterCardItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
