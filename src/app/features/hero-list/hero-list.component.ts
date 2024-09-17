import { Component, OnInit } from '@angular/core';
import { DataViewModule, DataViewPageEvent } from 'primeng/dataview';
import { CharactersService } from '../../core/services/characters/characters.service';
import { IModelCustomResponse } from '../../interfaces/customResponse/custom-response.interface';
import { IModelCharacter } from '../../interfaces/character/character.interface';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'hero-list',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    DataViewModule,
    ProgressSpinnerModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule
  ],
  providers: [
    CharactersService
  ],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.css'
})
export class HeroListComponent implements OnInit {

  private _lst_Characters: IModelCharacter[] = [];

  public vPaginator: IModelCustomResponse = <IModelCustomResponse>{};

  public vIsLoaded: boolean = false;
  public vSearchText: string = '';

  constructor(private _appCharacterService: CharactersService) {}


  ngOnInit(): void {
    const characters: any = localStorage.getItem('characters');    
    this._lst_Characters = JSON.parse(characters);

    const cachedResponse: any = localStorage.getItem('response');
    this.vPaginator = JSON.parse(cachedResponse);

    if (!this.lst_Characters) {
      this.getCharacterList();
    } else {
      this.vIsLoaded = true;
    }
  }

  getCharacterList(pOffset: number = 0, pSuperHeroName: string = ''): void {    
    this._appCharacterService.getCharactersList(pOffset, pSuperHeroName)
    .subscribe({
      next: (response: IModelCustomResponse) => {
        console.log(response);
        this.vPaginator = response;
        this._lst_Characters = response.results;
        localStorage.setItem('characters', JSON.stringify(response.results));
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

  handleClickSearch(): void {
    console.log(this.vSearchText);
    this.getCharacterList(0, this.vSearchText);
    this.vSearchText = '';
  }

  handlePage(pEvent:  DataViewPageEvent): void {     
    this.vIsLoaded = false;   
    this.getCharacterList(pEvent.first, this.vSearchText);
  }


  get lst_Characters(): IModelCharacter[] {
    return this._lst_Characters;
  }

}
