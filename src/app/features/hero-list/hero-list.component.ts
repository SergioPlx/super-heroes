import { Component, OnInit } from '@angular/core';
import {  DataViewModule } from 'primeng/dataview';
import { CharactersService } from '../../core/services/characters/characters.service';
import { IModelCharacter } from '../../interfaces/character/character.interface';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

import { CharacterCardListItemComponent } from '../../shared/components/character-card-list-item/character-card-list-item.component';
import { SearcherComponent } from '../../shared/components/searcher/searcher.component';
import { ValueFilterPipe } from '../../shared/pipes/value-filter/value-filter.pipe';
import { NotificationService } from '../../core/services/notifications/notification.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CharacterCardItemComponent } from '../../shared/components/character-card-item/character-card-item.component';
import { LoaderService } from '../../core/services/loader/loader.service';
import { catchError, finalize, map, Observable, ObservableInput, of, tap, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'hero-list',
  standalone: true,
  imports: [
    ButtonModule,   
    CommonModule,   
    CharacterCardListItemComponent,  
    CharacterCardItemComponent, 
    DataViewModule,            
    SearcherComponent,
    ProgressSpinnerModule,    
    ValueFilterPipe
  ],
  providers: [
    CharactersService,    
    NotificationService,    
  ],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.css'
})
export class HeroListComponent implements OnInit {
  layout: any = 'list';
  //lst_Characters: IModelCharacter[] = [];


  lstHeros$: Observable<IModelCharacter[]> = new Observable<IModelCharacter[]>();
 
  public vTextSearched: string = '';    
  
  constructor(
    private _appCharacterService: CharactersService,
    private _appLoaderService: LoaderService,
    private _appNotificationService: NotificationService,
    private _router: Router
  ) {}


  ngOnInit(): void {
    this.getCharacterList();
  }
  
  getCharacterList(): void {    
    const heroes$ = this._appCharacterService.getCharactersList()
      .pipe(
        catchError(err => {
          this._appNotificationService.error('An error ocurrs');
          return throwError(() => err)
        })
      );
    
    this.lstHeros$ = this._appLoaderService.showLoaderUntilCompleted(heroes$);
  }

  handleSearch(pTextSearch: string): void {    
    this.vTextSearched = pTextSearch;
  }
  
  handleClickEdit(pSuperHeroId: number): void {
    this._router.navigate(['hero', pSuperHeroId]);
  }

  handleClickDelete(pSuperHeroId: number): void {    
    const heroDeleted$ = this._appCharacterService.deleteSuperHero(pSuperHeroId);

    this.lstHeros$ = this._appLoaderService.showLoaderUntilCompleted(heroDeleted$)
      .pipe(
        tap(() =>this._appNotificationService.success('Super hero is deleted successfully')),
        catchError(err => {
          this._appNotificationService.error('An error ocurrs deleting super hero');                    
          return this._appCharacterService.getCharactersList();
        })        
      );
  }

  handleClickNewHero(): void {
    this._router.navigate(['hero', 'new']);
  }
}
