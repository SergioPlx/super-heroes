import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharecterFormComponent } from './charecter-form.component';

describe('CharecterFormComponent', () => {
  let component: CharecterFormComponent;
  let fixture: ComponentFixture<CharecterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharecterFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharecterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
