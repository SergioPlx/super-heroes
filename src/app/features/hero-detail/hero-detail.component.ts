import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CharactersService } from '../../core/services/characters/characters.service';
import { IModelCustomResponse } from '../../interfaces/customResponse/custom-response.interface';
import { IModelCharacter } from '../../interfaces/character/character.interface';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';

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
export class HeroDetailComponent implements OnInit {

  private _superHeroId!: string | null;
  private _row_SuperHero: IModelCharacter = <IModelCharacter>{};

  public vIsNew: boolean = true;
  public formGroup: FormGroup = new FormGroup ({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    image: new FormControl('')
  });

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _appCharacterService: CharactersService
  ) {    
    this._activatedRoute.paramMap.subscribe({
      next: (params) => {        
        const id = params.get('id');
        this._superHeroId = id;
        this.vIsNew = false;        
      }
    });
  }


  ngOnInit(): void {
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
            console.log(response.results.at(0));
            this._row_SuperHero = response.results.at(0);
            localStorage.setItem('superHero' + this._superHeroId, JSON.stringify(response.results.at(0)));
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
            console.log('complete');
          }
        });
    } else {
      console.log('Get super hero from cache', this.row_SuperHero);
      this.formGroup.setValue({
        name: this.row_SuperHero.name,
        description: this.row_SuperHero.description,
        image: `${this.row_SuperHero.thumbnail.path}.${this.row_SuperHero.thumbnail.extension}`
      });
    }
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
