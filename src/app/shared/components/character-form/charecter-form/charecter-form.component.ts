import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IModelCharacter } from '../../../../interfaces/character/character.interface';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'charecter-form',
  standalone: true,
  imports: [
    FileUploadModule,
    InputTextModule,
    InputTextareaModule, 
    ReactiveFormsModule    
  ],
  templateUrl: './charecter-form.component.html',
  styleUrl: './charecter-form.component.css'
})
export class CharecterFormComponent implements OnInit, OnChanges {

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
