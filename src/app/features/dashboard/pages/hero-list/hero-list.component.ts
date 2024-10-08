import {Component, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
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

  public _appCharacterService = inject(CharactersService);  
  public _appLoaderService = inject(LoaderService);
  private _appNotificationService = inject(NotificationService);
  private _router = inject(Router);

  constructor() {}

  ngOnInit(): void {}
  
  handleSearch(pTextSearch: string): void {        
    this._appLoaderService.showLoaderUntilCompleted(
      this._appCharacterService.searchSuperHeroes(pTextSearch)
    ).subscribe();
  }
  
  handleClickEdit(pSuperHeroId: number): void {
    this._router.navigate(['dashboard', 'hero', pSuperHeroId]);
  }

  handleClickDelete(pSuperHeroId: number): void {        
    this._appLoaderService.showLoaderUntilCompleted(
      this._appCharacterService.deleteSuperHero(pSuperHeroId)
    )
    .subscribe({
      next: (response: IModelCharacter[]) => {},
      error: (err) => this._appNotificationService.show('An error ocurrs deleting super hero'),
      complete: () => this._appNotificationService.show('Super hero is deleted successfully')
    })
  }
}
