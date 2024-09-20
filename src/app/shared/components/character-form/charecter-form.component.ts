import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IModelCharacter } from '../../../interfaces/character/character.interface';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { TextUppercaseDirective } from '../../directives/text-uppercase/text-uppercase.directive';
import { CommonModule } from '@angular/common';

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
export class CharecterFormComponent implements OnInit, OnChanges {

  @ViewChild('ctrlSuperHeroImage', {static: false}) vCtrlSuperHeroImage!: ElementRef;

  @Input() vinput_IsNew: boolean = false;
  @Input() vinput_IsLoaded: boolean = false;
  @Input() vinput_rowSuperHero: IModelCharacter = <IModelCharacter>{};

  public formCharacterGroup: FormGroup = new FormGroup({})

  constructor() {
    this._initForm();
  }


  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vinput_rowSuperHero'].currentValue.id) {      
      this._updateForm();
    }
  }

  onUpload(pEvent:  FileSelectEvent): void {        
    this.vCtrlSuperHeroImage.nativeElement.onload = () => {
      let imgCanvas = document.createElement('canvas');
      let imgContext = imgCanvas.getContext('2d');

      imgCanvas.width = this.vCtrlSuperHeroImage.nativeElement.offsetWidth;
      imgCanvas.height = this.vCtrlSuperHeroImage.nativeElement.offsetHeight;

      imgContext?.drawImage(this.vCtrlSuperHeroImage.nativeElement, 0, 0, this.vCtrlSuperHeroImage.nativeElement.offsetWidth, this.vCtrlSuperHeroImage.nativeElement.offsetHeight);

      this.formCharacterGroup.patchValue({image: imgCanvas.toDataURL('image/jpg')});
    }    
    this.row_SuperHero.image = URL.createObjectURL(pEvent.files[0]);
  }

  private _initForm(): void {
    this.formCharacterGroup = new FormGroup ({            
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      image: new FormControl('http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg')
    })
  }

  private _updateForm(): void {
    this.formCharacterGroup.patchValue({      
      name: this.row_SuperHero.name,
      description: this.row_SuperHero.description,
      image: this.row_SuperHero.image
    })
  }

  get row_SuperHero(): IModelCharacter {
    return this.vinput_rowSuperHero;
  }

  get isValid(): boolean {
    return this.formCharacterGroup.valid;
  }

}
