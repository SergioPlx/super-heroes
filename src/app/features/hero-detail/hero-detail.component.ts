import { OnInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CharactersService } from '../../core/services/characters/characters.service';
import { IModelCharacter } from '../../interfaces/character/character.interface';
import { ButtonModule } from 'primeng/button';
import { CharecterFormComponent } from '../../shared/components/character-form/charecter-form.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NotificationService } from '../../core/services/notifications/notification.service';

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
 
  @ViewChild('ctrlCharacterForm', {static: false}) vCtrlCharacterForm!: CharecterFormComponent;

  private _superHeroId!: string | null;
  private _row_SuperHero: IModelCharacter = <IModelCharacter>{};

  public vIsNew: boolean = true;
  public vIsLoaded: boolean = false;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _appCharacterService: CharactersService,    
    private _appNotificationService: NotificationService,    
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
      .subscribe({
        next: (result: IModelCharacter) => {        
          this._row_SuperHero = result;          
        }, 
        error: (err) => {                            
          this._appNotificationService.error('An error ocurred while getting the hero');
          this.handleClickBack();
        },
        complete: () => {
         this.vIsLoaded = true;         
        }
      })
  }

  handleClickSave(): void {    
    const lrowNewCharacter: IModelCharacter = <IModelCharacter>this.vCtrlCharacterForm.formCharacterGroup.value;
    this.vIsLoaded = false;
    if (this.vIsNew) {
      this._appCharacterService.postSuperHero(lrowNewCharacter)
        .subscribe(res => {                                
            this._appNotificationService.success('Super hero is saved successfully');
            this.handleClickBack();
        });
    } else {
      this._appCharacterService.updateSuperHero(this._superHeroId, lrowNewCharacter)
        .subscribe(res => {          
          this._appNotificationService.success('Super hero is updated successfully')
          this.handleClickBack();
        })
    }
  }

  handleClickBack(): void {    
    this._router.navigate(['heroList']);
  }

  get row_SuperHero(): IModelCharacter {
    return this._row_SuperHero;
  }

  get isValid(): boolean {    
    return this.vCtrlCharacterForm?.isValid;
  }

}
