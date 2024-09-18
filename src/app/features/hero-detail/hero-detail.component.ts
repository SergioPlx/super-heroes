import { OnInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CharactersService } from '../../core/services/characters/characters.service';
import { IModelCharacter } from '../../interfaces/character/character.interface';
import { ButtonModule } from 'primeng/button';
import { CharecterFormComponent } from '../../shared/components/character-form/charecter-form.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [
    ButtonModule,
    CharecterFormComponent,
    ToastModule    
  ],
  providers: [
    CharactersService,
    MessageService
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
    private messageService: MessageService
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
            this._showNotificationSuccess();
        });
    } else {
      this._appCharacterService.updateSuperHero(this._superHeroId, lrowNewCharacter)
        .subscribe(res => {                    
          this._showNotificationSuccess();
        })
    }
  }

  handleClickBack(): void {    
    this._router.navigate(['heroList']);
  }

  private _showNotificationSuccess(): void {
    this.messageService.add(
      { 
        detail: 'Super hero is saved successfully',
        life: 1500,
        severity: 'success', 
        summary: 'Success', 
      }
    );
  }
  
  // TODO: Manage errors

  get row_SuperHero(): IModelCharacter {
    return this._row_SuperHero;
  }

  get isValid(): boolean {    
    return this.vCtrlCharacterForm?.isValid;
  }

}
