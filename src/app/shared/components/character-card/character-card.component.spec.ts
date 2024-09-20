import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterCardComponent } from './character-card.component';

fdescribe('CharacterCardComponent', () => {
  let component: CharacterCardComponent;
  let fixture: ComponentFixture<CharacterCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterCardComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit edit hero when click edit button, handleClickEdit()', ()=> {
    spyOn(component.voutput_onEdit, 'emit');  
    const buttonEdit = fixture.nativeElement.querySelector('.p-button-success');    
    buttonEdit.click();
    expect(component.voutput_onEdit.emit).toHaveBeenCalled();
  })

});
