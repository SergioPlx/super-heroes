import { Component, ElementRef, input, OnInit, output, ViewChild} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IModelCharacter } from '../../../interfaces/character/character.interface';
import { TextUppercaseDirective } from '../../directives/text-uppercase/text-uppercase.directive';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { ImageUploaderComponent } from '../image-uploader/image-uploader.component';

type heroUpdated ={
  hero: IModelCharacter,
  image: string
}

@Component({
  selector: 'charecter-form',
  standalone: true,
  imports: [    
    ImageUploaderComponent,        
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    TextUppercaseDirective    
  ],
  providers: [
  ],
  templateUrl: './charecter-form.component.html',
  styleUrl: './charecter-form.component.css'
})
export class CharecterFormComponent implements OnInit {

  @ViewChild('ctrlSuperHeroImage', {static: false}) vCtrlSuperHeroImage!: ElementRef;
  
  public hero = input<IModelCharacter>();
  public onChangeImage = output<heroUpdated>();
  
  public formCharacterGroup: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    image: new FormControl('http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg')
  })

  constructor() {}

  private _updateForm(): void {    
    this.formCharacterGroup.patchValue({
      name: this.hero()?.name,
      description: this.hero()?.description,
      image: this.hero()?.image
    });    
  }


  ngOnInit(): void {
    this._updateForm();
  }

  onUploadImage(pFile: string | ArrayBuffer | null): void {
    this.formCharacterGroup.patchValue({image: pFile});        
    this.onChangeImage.emit(<heroUpdated>{hero: this.hero(), image: this.formCharacterGroup.value.image});
  }


  get isValid(): boolean {
    return this.formCharacterGroup?.valid;
  }
}
