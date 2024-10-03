import { OnInit, Component, ViewChild, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CharactersService } from '../../core/services/characters/characters.service';
import { IModelCharacter } from '../../interfaces/character/character.interface';
import { ButtonModule } from 'primeng/button';
import { CharecterFormComponent } from '../../shared/components/character-form/charecter-form.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NotificationService } from '../../core/services/notifications/notification.service';
import { LoaderService } from '../../core/services/loader/loader.service';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [
    ButtonModule,
    CharecterFormComponent,
    ProgressSpinnerModule,
  ],
  providers: [
    CharactersService,    
    NotificationService
  ],
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.css'
})
export class HeroDetailComponent implements OnInit {
  
  private _appCharacterService = inject(CharactersService);
  private _appLoaderService = inject(LoaderService);
  private _appNotificationService = inject(NotificationService);
  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);

  private _superHeroId!: string | null;
  private _row_SuperHero: IModelCharacter = <IModelCharacter>{};
 
  vIsNew: boolean = true; 

  @ViewChild('ctrlCharacterForm', {static: false}) vCtrlCharacterForm!: CharecterFormComponent;

  constructor() {
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
    }
  }

  getSuperHero(): void {

    this._appLoaderService.showLoaderUntilCompleted(this._appCharacterService.getCharacterById(this._superHeroId))
      .subscribe({
        next: (result: IModelCharacter) => {        
          this._row_SuperHero = result;          
        }, 
        error: (err) => {                            
          this._appNotificationService.error('An error ocurred while getting the hero');
          this.handleClickBack();
        },
        complete: () => this._appLoaderService.setOff()
      })
  }

  handleClickSave(): void {    
    const lrowNewCharacter: IModelCharacter = <IModelCharacter>this.vCtrlCharacterForm.formCharacterGroup.value;    
    (this.vIsNew) ? this._createSuperHero(lrowNewCharacter) : this._updateSuperHero(lrowNewCharacter);
  }

  handleClickBack(): void {    
    this._router.navigate(['heroList']);
  }
  
  private _createSuperHero(prowSuperHero: IModelCharacter): void {
    this._appLoaderService.showLoaderUntilCompleted(this._appCharacterService.postSuperHero(prowSuperHero))
    .subscribe(res => {                                
        this._appNotificationService.success('Super hero is saved successfully');
        this.handleClickBack();
    });
  }

  private _updateSuperHero(prow_SuperHero: IModelCharacter): void {
    this._appLoaderService.showLoaderUntilCompleted(this._appCharacterService.updateSuperHero(this._superHeroId, prow_SuperHero))
      .subscribe(res => {          
        this._appNotificationService.success('Super hero is updated successfully')
        this.handleClickBack();
      })
  }

  get row_SuperHero(): IModelCharacter {
    return this._row_SuperHero;
  }

  get isValid(): boolean {    
    return this.vCtrlCharacterForm?.isValid;
  }

}
