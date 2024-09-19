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
import { ValueFilterPipe } from '../../shared/pipes/value-filter/value-filter.pipe';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'hero-list',
  standalone: true,
  imports: [
    ButtonModule,    
    DataViewModule,        
    CharacterCardComponent,    
    SearcherComponent,
    ToastModule,
    ValueFilterPipe
  ],
  providers: [
    CharactersService,
    MessageService
  ],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.css'
})
export class HeroListComponent implements OnInit {

  lst_Characters: IModelCharacter[] = [];
  public vTextSearched: string = '';
  
  public vIsLoaded: boolean = false;

  constructor(
    private _appCharacterService: CharactersService,
    private _messageService: MessageService,
    private _router: Router
  ) {}


  ngOnInit(): void {
    this.getCharacterList();
  }
  
  getCharacterList(): void {    
    this._appCharacterService.getCharactersList()
      .subscribe({
        next: (response: any) => {
          this.lst_Characters = response;
        },
        complete:() => {
          this.vIsLoaded = true;
        }
      });
  }

  handleSearch(pTextSearch: string): void {    
    // this.getCharacterList(0, pTextSearch);
    this.vTextSearched = pTextSearch;
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
          this.lst_Characters = response;         
        },
        complete: () => {
          this._showNotificationSuccess();
          this.vIsLoaded = true;
        }
      });
  }


  handleClickNewHero(): void {
    this._router.navigate(['heroDetail']);
  }

  private _showNotificationSuccess(): void {
    this._messageService.add(
      { 
        detail: 'Super hero is deleted successfully',
        life: 1500,
        severity: 'success', 
        summary: 'Success', 
      }
    );
  }

}
