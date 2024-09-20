import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterCardComponent } from './character-card.component';
import { ConfirmationService } from 'primeng/api';

describe('CharacterCardComponent', () => {
  let component: CharacterCardComponent;
  let fixture: ComponentFixture<CharacterCardComponent>;
  let confirmationService: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CharacterCardComponent
      ]      
    })
    .compileComponents();
    
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterCardComponent);
    component = fixture.componentInstance;
    confirmationService = fixture.debugElement.injector.get(ConfirmationService);
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
  });

  it('should accept confirmation when try to delete hero, handleClickDelete()', () => {
    spyOn(component.voutput_onDelete, 'emit');
    spyOn(confirmationService, 'confirm').and.callFake((params: any) => {      
      params.accept();
      expect(component.voutput_onDelete.emit).toHaveBeenCalled();
    });

    const buttonDelete = fixture.nativeElement.querySelector('.p-button-danger');
    buttonDelete.click();
  });

  it('should reject confirmation when try to delete hero, handleClickDelete()', () => {
    spyOn(component.voutput_onDelete, 'emit');
    spyOn(confirmationService, 'confirm').and.callFake((params: any) => {      
      params.reject();
      expect(component.voutput_onDelete.emit).not.toHaveBeenCalled();
    });

    const buttonDelete = fixture.nativeElement.querySelector('.p-button-danger');
    buttonDelete.click();
  });

});
