import { AfterViewInit, Component, ElementRef, Sanitizer, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CharactersService } from '../../core/services/characters/characters.service';
import { IModelCustomResponse } from '../../interfaces/customResponse/custom-response.interface';
import { IModelCharacter } from '../../interfaces/character/character.interface';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    FileUploadModule
  ],
  providers: [
    CharactersService
  ],
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.css'
})
export class HeroDetailComponent implements AfterViewInit {

  @ViewChild('ctrlSuperHeroImage', {static: false}) vCtrlSuperHeroImage!: ElementRef;

  private _superHeroId!: string | null;
  private _row_SuperHero: IModelCharacter = <IModelCharacter>{};

  public vIsNew: boolean = true;
  public vIsLoaded: boolean = false;

  public formGroup!: FormGroup;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _appCharacterService: CharactersService,
    private _sanitizer: DomSanitizer
  ) {    
    this._activatedRoute.paramMap.subscribe({
      next: (params) => {        
        const id = params.get('id');
        this._superHeroId = id;
        this.vIsNew = this._superHeroId === null;        
      }
    });

    this.formGroup = new FormGroup ({
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      image: new FormControl('')
    })
  }

  ngAfterViewInit(): void {
    if (!this.vIsNew) {      
      this.getSuperHero();
    }
  }

  getSuperHero(): void {
    const superHero: any = localStorage.getItem('superHero' + this._superHeroId);
    this._row_SuperHero = JSON.parse(superHero);

    if (!this.row_SuperHero) {
      this._appCharacterService.getCharacterById(this._superHeroId)
        .subscribe({
          next: (response: IModelCustomResponse) => {
            this._row_SuperHero = response.results.at(0);
            localStorage.setItem('superHero' + this._superHeroId, JSON.stringify(response.results.at(0)));
          },
          error: (err) => {
            console.log(err);
            this.vIsLoaded = true;
          },
          complete: () => {
            console.log('complete');
            this.vIsLoaded = true;
          }
        });
    } else {
      console.log('Get super hero from cache', this.row_SuperHero);
      this.formGroup.setValue({
        name: this.row_SuperHero.name,
        description: this.row_SuperHero.description,
        image: this.row_SuperHero.image
      });
      this.vIsLoaded = true;
    }
  }

  handleClickSave(): void {    
    const cachedCharacters: any = localStorage.getItem('characters');
    const llst_CachedCharacters: IModelCharacter[] = JSON.parse(cachedCharacters) || [];


    // if (llst_CachedCharacters.length) {    
      const lIndex: number = llst_CachedCharacters.findIndex((llrow_Character: IModelCharacter) => llrow_Character.id.toString() === this._superHeroId);

      // if (lIndex > 0) {
        const lnew_Character: IModelCharacter = {...this.row_SuperHero};
        lnew_Character.name = this.formGroup.value.name;
        lnew_Character.description = this.formGroup.value.description;
        lnew_Character.image = this.formGroup.value.image;
        // this.row_SuperHero.name = this.formGroup.value.name;
        // this.row_SuperHero.description = this.formGroup.value.description;

        console.log(llst_CachedCharacters);

        if (lIndex !== -1) {
          llst_CachedCharacters[lIndex] = {...lnew_Character};
        } else {
          llst_CachedCharacters.push(lnew_Character);
        }

        localStorage.removeItem('updatedCharacters');
        localStorage.setItem('updatedCharacters', JSON.stringify(llst_CachedCharacters));        
        localStorage.removeItem('superHero' + this._superHeroId);
        localStorage.setItem('superHero' + this._superHeroId, JSON.stringify(lnew_Character));


        this._router.navigate(['heroList']);
      // }
    //}
    
  }

  handleUploadFile(pEvent:  FileSelectEvent): void {
    const file: any = pEvent.currentFiles.at(0);    
    

    let reader = new FileReader();
    reader.onload = (evt: any) => {      
      // this.vCtrlSuperHeroImage.nativeElement.file = evt.target.result;      
      // this._row_SuperHero.thumbnail.extension = fileExtension;
      // console.log(evt);
      // this._row_SuperHero.image = URL.createObjectURL(file);
      console.log(this._row_SuperHero.image)
      this.formGroup.patchValue({image: this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file))});
      this.vCtrlSuperHeroImage.nativeElement.src = file.objectURL.changingThisBreaksApplicationSecurity;
    }
    reader.readAsText(file);
  }

  handleClickBack(): void {    
    this.clearSuperHero();
    this._router.navigate(['heroList']);
  }

  private clearSuperHero(): void {
    if (!this.vIsNew) {
      localStorage.removeItem('superHero' + this._superHeroId);
    }
  }

  get row_SuperHero(): IModelCharacter {
    return this._row_SuperHero;
  }

}
