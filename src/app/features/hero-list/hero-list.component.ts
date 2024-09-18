import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataViewModule, DataViewPageEvent } from 'primeng/dataview';
import { CharactersService } from '../../core/services/characters/characters.service';
import { IModelCustomResponse } from '../../interfaces/customResponse/custom-response.interface';
import { IModelCharacter } from '../../interfaces/character/character.interface';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { Router } from '@angular/router';

import { CharacterCardComponent } from '../../shared/components/character-card/character-card.component';
import { SearcherComponent } from '../../shared/components/searcher/searcher.component';

@Component({
  selector: 'hero-list',
  standalone: true,
  imports: [
    ButtonModule,
    DataViewModule,        
    CharacterCardComponent,
    SearcherComponent
  ],
  providers: [
    CharactersService
  ],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.css'
})
export class HeroListComponent implements OnInit {

  private _lst_Characters: IModelCharacter[] = [];
  private _textSearched: string = '';

  public vPaginator: IModelCustomResponse = <IModelCustomResponse>{};

  public vIsLoaded: boolean = false;
  // public vSearchText: string = '';

  constructor(
    private _appCharacterService: CharactersService,
    private _router: Router
  ) {}


  ngOnInit(): void {
    const characters: any = localStorage.getItem('characters');    
    this._lst_Characters = JSON.parse(characters) || [];

    // TODO: Refactor to use api
    if (!this.lst_Characters.length) {
      this.getCharacterList();
    } else {
      const llst_UpdatedCharacters: IModelCharacter[] = JSON.parse(localStorage.getItem('updatedCharacters') || '');
      this._lst_Characters = this._lst_Characters.map((lrow_Character: IModelCharacter) => {
        const lIsSomeSuperHeroUpdated: boolean = llst_UpdatedCharacters.some((llrowUpdateSuperHero: IModelCharacter) => llrowUpdateSuperHero.id === lrow_Character.id);
        if (lIsSomeSuperHeroUpdated) {
          const lrow_UpdatedCharacter: IModelCharacter = <IModelCharacter>llst_UpdatedCharacters.find((llrowUpdateSuperHero: IModelCharacter) => llrowUpdateSuperHero.id === lrow_Character.id);
          lrow_Character = {...lrow_UpdatedCharacter};          
        }
        return lrow_Character
      })

      this.vIsLoaded = true;
      console.log('from cache');
      const cachedResponse: any = localStorage.getItem('response');
      this.vPaginator = JSON.parse(cachedResponse);
    }
  }

  // TODO: Refactor to use service
  getCharacterList(pOffset: number = 0, pSuperHeroName: string = ''): void {    

    const llst_CopyCharacters: IModelCharacter[] = [];

    this._appCharacterService.getCharactersList(pOffset, pSuperHeroName)
    .subscribe({
      next: (response: IModelCustomResponse) => {
        console.log(response);
        this.vPaginator = response;

        const llst_UpdatedCharacters: IModelCharacter[] = JSON.parse(localStorage.getItem('updatedCharacters') || '');

        response.results.forEach((lrow_Character: IModelCharacter) => {        
          const lSuperHeroIdDeleted: any = localStorage.getItem('deleteSuperHero' + lrow_Character.id); 
        
          if (!lSuperHeroIdDeleted) {
            const lIsSomeSuperHeroUpdated: boolean = llst_UpdatedCharacters.some((llrowUpdateSuperHero: IModelCharacter) => llrowUpdateSuperHero.id === lrow_Character.id);
            if (lIsSomeSuperHeroUpdated) {
              const lrow_UpdatedCharacter: IModelCharacter = <IModelCharacter>llst_UpdatedCharacters.find((llrowUpdateSuperHero: IModelCharacter) => llrowUpdateSuperHero.id === lrow_Character.id);
              lrow_Character = {...lrow_UpdatedCharacter};

            }
            llst_CopyCharacters.push(lrow_Character);
            
          }
        })
      
        this._lst_Characters = [...llst_CopyCharacters];      
        localStorage.setItem('characters', JSON.stringify(this._lst_Characters));
        localStorage.setItem('response', JSON.stringify(response));
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.vIsLoaded = true;
      }
    });
  }

  handleSearch(pTextSearch: string): void {    
    this.getCharacterList(0, pTextSearch);
    this._textSearched = pTextSearch;
  }

  handlePage(pEvent:  DataViewPageEvent): void {     
    this.vIsLoaded = false;       
    this.getCharacterList(pEvent.first, this._textSearched);
  }

  // TODO: Refactor to use api
  handleClickEdit(pSuperHeroId: number): void {
    this._router.navigate(['heroDetail', pSuperHeroId]);
  }

  // TODO: Refactor to use api
  handleClickDelete(pSuperHeroId: number): void {
    localStorage.setItem('deleteSuperHero' + pSuperHeroId, JSON.stringify(pSuperHeroId));

    this.onDeleteSuperHero(pSuperHeroId);
  }

  // TODO: Refactor to use api
  onDeleteSuperHero(pSuperHeroId: number): void {
    const lSuperHeroIndex: number = this.lst_Characters.findIndex((lrow_SuperHero: IModelCharacter) => lrow_SuperHero.id === pSuperHeroId);
    if (lSuperHeroIndex !== -1) {
      this._lst_Characters.splice(lSuperHeroIndex, 1); 
      localStorage.setItem('characters', JSON.stringify(this._lst_Characters));
    }
  }
  

  handleClickNewHero(): void {
    this._router.navigate(['heroDetail']);
  }


  get lst_Characters(): IModelCharacter[] {
    return this._lst_Characters;
  }

}
