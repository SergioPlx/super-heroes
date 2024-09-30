import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CharacterCardListItemComponent } from './character-card-list-item.component';
import { ConfirmationService } from 'primeng/api';

describe('CharacterCardComponent', () => {
  let component: CharacterCardListItemComponent;
  let fixture: ComponentFixture<CharacterCardListItemComponent>;
  let confirmationService: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CharacterCardListItemComponent
      ]      
    })
    .compileComponents();
    
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterCardListItemComponent);
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

  it('should check character card has an image', () => {
    const lCardImg = fixture.nativeElement.querySelector('img');
    expect(lCardImg).toBeTruthy();
  });

  it('should get card buttons', () => {
    const lCardButtons = fixture.nativeElement.getElementsByTagName('p-button');    
    expect(lCardButtons).toBeTruthy();
    expect([].slice.call(lCardButtons).length).toBe(2);
  });

  it('should has a confirm dialog', ()=> {
    const lConfirmDialog = fixture.nativeElement.querySelector('p-confirmDialog');
    expect(lConfirmDialog).toBeTruthy();
  });

});
