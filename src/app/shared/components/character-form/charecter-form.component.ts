import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IModelCharacter } from '../../../interfaces/character/character.interface';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { TextUppercaseDirective } from '../../directives/text-uppercase/text-uppercase.directive';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'charecter-form',
  standalone: true,
  imports: [    
    CommonModule,
    FileUploadModule,
    InputTextModule,
    InputTextareaModule, 
    ReactiveFormsModule,
    TextUppercaseDirective
  ],
  templateUrl: './charecter-form.component.html',
  styleUrl: './charecter-form.component.css'
})
export class CharecterFormComponent implements OnInit {

  @ViewChild('ctrlSuperHeroImage', {static: false}) vCtrlSuperHeroImage!: ElementRef;
  
  @Input() vinput_rowHero$: Observable<IModelCharacter> = new Observable<IModelCharacter>();

  public formCharacterGroup: FormGroup = new FormGroup({})

  constructor() {
    this._initForm();
  }

  ngOnInit(): void {
    this.vinput_rowHero$.subscribe(
      (value) => this._updateForm(value)
    );
  }

  onUpload(pEvent:  FileSelectEvent): void {       
    let lBase64File: string | ArrayBuffer | null;

    for (let i: number = 0; i < pEvent.files.length; i++) {
      let lReader: FileReader = new FileReader();

      lReader.onload = (e) => {
        lBase64File = lReader.result;
        this.formCharacterGroup.patchValue({image: lBase64File});
      }

      lReader.readAsDataURL(pEvent.files[i]);
    }
  }

  private _initForm(): void {
    this.formCharacterGroup = new FormGroup ({            
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      image: new FormControl('http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg')
    })
  }

  private _updateForm(pHero: IModelCharacter): void {
    this.formCharacterGroup.patchValue({      
      name: pHero.name,
      description: pHero.description,
      image: pHero.image
    })
  }

  get rowHero$(): Observable<IModelCharacter> {
    return this.vinput_rowHero$;
  }

  get isValid(): boolean {
    return this.formCharacterGroup.valid;
  }

}
