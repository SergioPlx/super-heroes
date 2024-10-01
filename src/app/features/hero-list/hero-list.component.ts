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
import { ModelViewManager } from '../../models/view-manager/view-manager';
import { CharacterCardItemComponent } from '../../shared/components/character-card-item/character-card-item.component';

@Component({
  selector: 'hero-list',
  standalone: true,
  imports: [
    ButtonModule,    
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
  lst_Characters: IModelCharacter[] = [];
  public vTextSearched: string = '';  
  public row_AppViewManager: ModelViewManager = new ModelViewManager({loaded: false});
  
  constructor(
    private _appCharacterService: CharactersService,
    private _appNotificationService: NotificationService,
    private _router: Router
  ) {}


  ngOnInit(): void {
    this.getCharacterList();
  }
  
  getCharacterList(): void {    
    this._appCharacterService.getCharactersList()
      .subscribe({
        next: (llstHeroes: IModelCharacter[]) => {          
          this.lst_Characters = llstHeroes;          
        },
        error: (err) => {
          this._appNotificationService.error('An error ocurrs');      
        },
        complete:() => {          
          this.row_AppViewManager.setLoaded(true);
        }
      });
  }

  handleSearch(pTextSearch: string): void {    
    this.vTextSearched = pTextSearch;
  }
  
  handleClickEdit(pSuperHeroId: number): void {
    this._router.navigate(['hero', pSuperHeroId]);
  }

  handleClickDelete(pSuperHeroId: number): void {    
    this.row_AppViewManager.setLoaded(false);
    this._appCharacterService.deleteSuperHero(pSuperHeroId)
      .subscribe({
        next: (response: IModelCharacter[]) => {          
          this.lst_Characters = response;         
        },
        error: (err) => {          
          this._appNotificationService.error('An error ocurrs deleting super hero');
          this.getCharacterList();    
        },
        complete: () => {          
          this._appNotificationService.success('Super hero is deleted successfully');          
          this.row_AppViewManager.setLoaded(true);
        }
      });
  }

  handleClickNewHero(): void {
    this._router.navigate(['hero', 'new']);
  }
}
