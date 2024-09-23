import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharecterFormComponent } from './charecter-form.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { IModelCharacter } from '../../../interfaces/character/character.interface';
import { By } from '@angular/platform-browser';
import { FileUploadModule } from 'primeng/fileupload';


const DEFAULT_IMAGE: string = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';
const lMockForm = {
  name: 'Test1',
  description: 'Test 1 description',
  image: DEFAULT_IMAGE
}

describe('CharecterFormComponent', () => {
  let component: CharecterFormComponent;
  let fixture: ComponentFixture<CharecterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CharecterFormComponent,
        FileUploadModule
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharecterFormComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
  });

  beforeEach(async() => {
    const lrowHero: IModelCharacter = <IModelCharacter>{
      id: 1,
      name: 'Test1',
      description: 'Test 1 description',
      image: DEFAULT_IMAGE
    };

    fixture.componentRef.setInput('vinput_rowSuperHero', lrowHero);
    await fixture.whenStable();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update form when exist a hero', () => {                 
    expect(component.formCharacterGroup.value).toEqual(lMockForm);
  });

  it('should form is valid', () => {
    expect(component.isValid).toBe(true);
  });

  it('should put image on img', () => {
    const inputDebugEl  = fixture.debugElement.query(By.css('input[type=file]'));
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(new File([''], DEFAULT_IMAGE));

    inputDebugEl.nativeElement.files = dataTransfer.files;
    inputDebugEl.nativeElement.dispatchEvent(new InputEvent('change'));
    
    fixture.detectChanges();
    
    expect(component.row_SuperHero.image).toEqual(DEFAULT_IMAGE);
    expect(component.formCharacterGroup.value.image).toEqual(DEFAULT_IMAGE);
  });
});
