import { Component, OnInit } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { CharactersService } from '../../core/services/characters/characters.service';

@Component({
  selector: 'hero-list',
  standalone: true,
  imports: [
    DataViewModule
  ],
  providers: [
    CharactersService
  ],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.css'
})
export class HeroListComponent implements OnInit {

  private _lst_Characters: any[] = [];
  public vIsLoaded: boolean = false;

  constructor(private _appCharacterService: CharactersService) {}


  ngOnInit(): void {
    this._appCharacterService.getCharactersList()
      .subscribe({
        next: (result) => {
          console.log(result);
          // this._lst_Characters = result.
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.vIsLoaded = true;
        }
      })
  }


  get lst_Characters(): any[] {
    return this._lst_Characters;
  }

}
