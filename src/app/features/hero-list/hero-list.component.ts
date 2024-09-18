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
import { ConfirmDialogModule } from 'primeng/confirmdialog';

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
  
  public vIsLoaded: boolean = false;

  constructor(

    private _appCharacterService: CharactersService,
    private _router: Router
  ) {}


  ngOnInit(): void {
    this.getCharacterList();
  }
  
  getCharacterList(pOffset: number = 0, pSuperHeroName: string = ''): void {    
    this._appCharacterService.getCharactersList()
      .subscribe({
        next: (response: any) => {
          this._lst_Characters = response;
        },
        complete:() => {
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
    this.vIsLoaded = false;
    this._appCharacterService.deleteSuperHero(pSuperHeroId)
      .subscribe({
        next: (response: any) => {
          this._lst_Characters = response;            
        },
        complete: () => {
          this.vIsLoaded = true;
        }
      });
  }

  

  handleClickNewHero(): void {
    this._router.navigate(['heroDetail']);
  }


  get lst_Characters(): IModelCharacter[] {
    return this._lst_Characters;
  }

}
