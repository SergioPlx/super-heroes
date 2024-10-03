import { OnInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CharactersService } from '../../core/services/characters/characters.service';
import { IModelCharacter } from '../../interfaces/character/character.interface';
import { ButtonModule } from 'primeng/button';
import { CharecterFormComponent } from '../../shared/components/character-form/charecter-form.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NotificationService } from '../../core/services/notifications/notification.service';
import { LoaderService } from '../../core/services/loader/loader.service';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
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

  rowHero$: Observable<IModelCharacter> = new Observable<IModelCharacter>();
  vIsNew: boolean = true; 

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _appCharacterService: CharactersService,  
    private _appLoaderService: LoaderService,  
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

  private _createSuperHero(prowSuperHero: IModelCharacter): void {
    const heroSaved$ = this._appCharacterService.postSuperHero(prowSuperHero);
    const newHero$ = this._appLoaderService.showLoaderUntilCompleted(heroSaved$)    
    .pipe(
        tap(() => {
          this._appNotificationService.success('Super hero is created successfully');
          this.handleClickBack();
        }),        
        catchError(err => {
          this._appNotificationService.error('An error ocurrs creating super hero');
          return throwError(() => err)
        })
    );
    newHero$.subscribe();
  }

  private _updateSuperHero(prowSuperHero: IModelCharacter): void {
    const heroUpdated$ = this._appCharacterService.updateSuperHero(this._superHeroId, prowSuperHero);
    const updatedHero$ = this._appLoaderService.showLoaderUntilCompleted(heroUpdated$)    
    .pipe(
        tap(() => {
          this._appNotificationService.success('Super hero is updated successfully')
          this.handleClickBack();
        }),        
        catchError(err => {
          this._appNotificationService.error('An error ocurrs updating super hero');
          return throwError(() => err)
        })
    );
    updatedHero$.subscribe();
  }

  ngOnInit(): void {        
    if (!this.vIsNew) {
      this.getSuperHero();
    }
  }

  getSuperHero(): void {  
    const hero$ = this._appCharacterService.getCharacterById(this._superHeroId);
    this.rowHero$ = this._appLoaderService.showLoaderUntilCompleted(hero$);
  }

  handleClickSave(): void {    
    const lrowNewCharacter: IModelCharacter = <IModelCharacter>this.vCtrlCharacterForm.formCharacterGroup.value;
    (this.vIsNew) ? this._createSuperHero(lrowNewCharacter) : this._updateSuperHero(lrowNewCharacter);
  }

  handleClickBack(): void {    
    this._router.navigate(['heroList']);
  }
  
  get isValid(): boolean {    
    return this.vCtrlCharacterForm?.isValid;
  }
}