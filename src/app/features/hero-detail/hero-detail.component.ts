import { OnInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CharactersService } from '../../core/services/characters/characters.service';
import { IModelCharacter } from '../../interfaces/character/character.interface';
import { ButtonModule } from 'primeng/button';
import { CharecterFormComponent } from '../../shared/components/character-form/charecter-form/charecter-form.component';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [
    ButtonModule,
    CharecterFormComponent
  ],
  providers: [
    CharactersService
  ],
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.css'
})
export class HeroDetailComponent implements OnInit {
 
  @ViewChild('ctrlCharacterForm', {static: false}) vCtrlCharacterForm!: CharecterFormComponent;

  private _superHeroId!: string | null;
  private _row_SuperHero: IModelCharacter = <IModelCharacter>{};

  public vIsNew: boolean = true;
  public vIsLoaded: boolean = false;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _appCharacterService: CharactersService
  ) {    
    this._activatedRoute.paramMap.subscribe({
      next: (params) => {        
        const id = params.get('id');
        this._superHeroId = id;
        this.vIsNew = this._superHeroId === null;        
      }
    });    
  }

  ngOnInit(): void {    
    if (!this.vIsNew) {      
      this.getSuperHero();
    } else {
      this.vIsLoaded = true;
    }
  }

  getSuperHero(): void {
    this._appCharacterService.getCharacterById(this._superHeroId)
      .subscribe((result: IModelCharacter) => {
        this.vIsLoaded = true;
        this._row_SuperHero = result;
      })
  }

  handleClickSave(): void {    
    const lrowNewCharacter: IModelCharacter = <IModelCharacter>this.vCtrlCharacterForm.formCharacterGroup.value;

    if (this.vIsNew) {
      this._appCharacterService.postSuperHero(lrowNewCharacter)
        .subscribe(res => {
          console.log(res);
          // TODO: Add Toast
          this._router.navigate(['heroList']);
        });
    } else {
      this._appCharacterService.updateSuperHero(this._superHeroId, lrowNewCharacter)
        .subscribe(res => {
          console.log(res);
          // TODO: Add Toast
          this._router.navigate(['heroList']);
        })
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

  get isValid(): boolean {    
    return this.vCtrlCharacterForm?.isValid;
  }

}
