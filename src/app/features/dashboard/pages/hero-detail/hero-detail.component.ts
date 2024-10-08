import { Component, ViewChild, inject, computed, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CharactersService } from '@core/services/characters/characters.service';
import { NotificationService } from '@core/services/notifications/notification.service';
import { LoaderService } from '@core/services/loader/loader.service';
import { IModelCharacter } from '@interfaces/character/character.interface';
import { CharecterFormComponent } from '@shared/components/character-form/charecter-form.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { TitleComponent } from '@shared/components/title/title.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [
    CharecterFormComponent,
    MatButtonModule,
    MatIconModule,
    TitleComponent,
  ],
  providers: [
    CharactersService,    
    NotificationService
  ],
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.css'
})
export class HeroDetailComponent {
  
  private _appCharacterService = inject(CharactersService);
  private _appLoaderService = inject(LoaderService);
  private _appNotificationService = inject(NotificationService);
  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);

  private _superHeroId!: string | null;
 
  public hero = toSignal<IModelCharacter>(
    this._activatedRoute.params
    .pipe(
      switchMap(({id}) => this._appLoaderService.showLoaderUntilCompleted(this._appCharacterService.getCharacterById(id)))      
    )
  );

  public isNew = computed(() => this.hero()?.id === undefined);
  public superHeroId = computed(() => this.hero()?.id);

  @ViewChild('ctrlCharacterForm', {static: false}) vCtrlCharacterForm!: CharecterFormComponent;

  constructor() {
    effect(() => {
      console.log('Hero: ', this.hero());
      console.log('Id: ', this.superHeroId())
      console.log('Is new: ', this.isNew());
    })
  }

  handleClickSave(): void {    
    const lrowNewCharacter: IModelCharacter = <IModelCharacter>this.vCtrlCharacterForm.formCharacterGroup.value;    
    (this.isNew()) ? this._createSuperHero(lrowNewCharacter) : this._updateSuperHero(lrowNewCharacter);
  }

  handleClickBack(): void {    
    this._router.navigate(['dashboard', 'heroes']);
  }
  
  private _createSuperHero(prowSuperHero: IModelCharacter): void {
    this._appLoaderService.showLoaderUntilCompleted(this._appCharacterService.postSuperHero(prowSuperHero))
    .subscribe(res => {                                
        this._appNotificationService.show('Super hero is saved successfully');
        this.handleClickBack();
    });
  }

  private _updateSuperHero(prow_SuperHero: IModelCharacter): void {
    this._appLoaderService.showLoaderUntilCompleted(this._appCharacterService.updateSuperHero(this._superHeroId, prow_SuperHero))
      .subscribe(res => {          
        this._appNotificationService.show('Super hero is updated successfully')
        this.handleClickBack();
      })
  }

  onChangeHeroImage(pCustomObject: any): void {
    console.log('Image: ', pCustomObject);
    pCustomObject.hero.image = pCustomObject.image;
  }

  get isValid(): boolean {
    return this.vCtrlCharacterForm?.isValid;
  }

}
