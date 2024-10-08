import {Component, inject, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import { tap } from 'rxjs';
import {MatButtonModule} from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTableModule} from '@angular/material/table';
import {MatListModule} from '@angular/material/list';
import {CharactersService} from '@core/services/characters/characters.service';
import {NotificationService} from '@core/services/notifications/notification.service';
import {LoaderService} from '@core/services/loader/loader.service';
import {IModelCharacter} from '@interfaces/character/character.interface';
import {SearcherComponent} from '@shared/components/searcher/searcher.component';
import {ValueFilterPipe} from '@shared/pipes/value-filter/value-filter.pipe';
import {CharacterCardItemComponent} from '@shared/components/character-card-item/character-card-item.component';
import {TitleComponent} from '@shared/components/title/title.component';

import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';

@Component({
  selector: 'hero-list',
  standalone: true,
  imports: [           
    CharacterCardItemComponent, 
    MatButtonModule,  
    MatGridListModule,    
    MatTableModule,
    MatListModule,
    SearcherComponent,
    TitleComponent,    
    ValueFilterPipe,

    MatPaginatorModule
  ],
  providers: [
    CharactersService,    
    NotificationService,    
  ],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.css'
})
export class HeroListComponent {
  
  #appNotificationService = inject(NotificationService);
  #router = inject(Router);
  public appCharacterService = inject(CharactersService);  
  public appLoaderService = inject(LoaderService);

  @ViewChild('ctrlPaginator') ctrlPaginator!: MatPaginator;
  
  constructor() {}
    
  handleSearch(pTextSearch: string): void {        
    this.appLoaderService.showLoaderUntilCompleted(
      this.appCharacterService.searchSuperHeroes(pTextSearch)
    ).pipe(
      tap(() => {
          if (!this.appCharacterService.currentFilter().length) {
            this.ctrlPaginator.firstPage();
          }
        }
      )
    ).subscribe();
  }
  
  handleClickEdit(pSuperHeroId: number): void {
    this.#router.navigate(['dashboard', 'hero', pSuperHeroId]);
  }

  handleClickDelete(pSuperHeroId: number): void {        
    this.appLoaderService.showLoaderUntilCompleted(
      this.appCharacterService.deleteSuperHero(pSuperHeroId)
    )
    .subscribe({
      next: (response: IModelCharacter[]) => {},
      error: (err) => this.#appNotificationService.show('An error ocurrs deleting super hero'),
      complete: () => this.#appNotificationService.show('Super hero is deleted successfully')
    })
  }

  handlePageEvent(pPageEvent: PageEvent) {    
    this.appCharacterService.getHeroesByPage(pPageEvent);
  }
}
