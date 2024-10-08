import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { catchError, concatMap, delay, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { IModelCharacter } from '../../../interfaces/character/character.interface';
import { StorageService } from '../storage/storage.service';
import { LoaderService } from '../loader/loader.service';

interface State {
  heroes: IModelCharacter[];
  loading: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CharactersService {

  #http = inject(HttpClient);
  #loaderService = inject(LoaderService);
  #storage = inject(StorageService);

  #state: WritableSignal<State> = signal<State>({
    loading: true,
    heroes: []
  });

  public heroes = computed(() => this.#state().heroes);
  public loading = computed(() => this.#state().loading);

  constructor() {
    console.log('Cargando data...');
    this.getCharactersList();
  }
  
  private getCharactersList(): void {
    const llstCharacters: IModelCharacter[] = this.#storage.getItem('lstCharacters');                      
    if (!llstCharacters || !llstCharacters.length) { 
      let url: string = `${environment.baseUrl}characters?limit=10&apikey=${environment.SECRET_KEY}`;    
      this.#loaderService.setOn();
      this.#http.get<IModelCharacter[]>(url)
        .pipe(
          map(response => this._mapResponse(response))
        )
        .subscribe( res => {
          this.#storage.setItem('lstCharacters', res);
          this.#state.set({
            loading: false,
            heroes: res
          });
          this.#loaderService.setOff();
        });
    } else {
      this.#state.set({
        loading: false,
        heroes: llstCharacters
      });
    }
    
    /*return this.http.get<IModelCharacter[]>(url)
      .pipe(
        map((result: any) => {                  
          const llstCharacters: IModelCharacter[] = this.#storage.getItem('lstCharacters');                      
          if (!llstCharacters || !llstCharacters.length) {            
            const llsMappedCharacters: IModelCharacter[] = this._mapResponse(result);
            this.#storage.setItem('lstCharacters', llsMappedCharacters);
            return llsMappedCharacters
          }

          return llstCharacters;
        }
      ),
      catchError(err => {
        throw <IModelCharacter[]>[];
      })
    );*/
  }
  
  

  getCharacterById(pSuperHeroId: string | null): Observable<IModelCharacter> {     
    try {
      let llstCharacters: IModelCharacter[] = this.#storage.getItem('lstCharacters');
      let lrow_Character: IModelCharacter = llstCharacters.find((lrowCurrentCharacter: IModelCharacter) => lrowCurrentCharacter.id.toString() === pSuperHeroId) ?? <IModelCharacter>{};    
      const lHasId = lrow_Character.id ?? null;  
      if (!lHasId) {
        return of(<IModelCharacter>{});
      }      
      return of(lrow_Character)
        .pipe(          
          delay(1000)
        );
    } catch(e) {
      return throwError(() => <IModelCharacter>{});
    }
  }
  
  postSuperHero(prow_SuperHero: IModelCharacter): Observable<IModelCharacter> {    
    try {
      let llstCharacters: IModelCharacter[] = this.#storage.getItem('lstCharacters');

      if (!llstCharacters) llstCharacters = <IModelCharacter[]>[];

      prow_SuperHero.id = this._getNextId(llstCharacters);
      llstCharacters.push(prow_SuperHero);
      this.#storage.setItem('lstCharacters', llstCharacters);
      return of(prow_SuperHero)
        .pipe(          
          delay(1000)
        );
    } catch(e) {
      return throwError(() => <IModelCharacter>{});
    }
  }
  
  updateSuperHero(pSuperHeroId: string | null, prow_SuperHero: IModelCharacter): Observable<IModelCharacter> {
    try {
      const llstCharacters: IModelCharacter[] = this.#storage.getItem('lstCharacters');  
      let lIndex = llstCharacters.findIndex((llrowCurrentCharacter: IModelCharacter) => llrowCurrentCharacter.id.toString() === pSuperHeroId);
      
      if (lIndex !== -1) {
        prow_SuperHero.id = llstCharacters[lIndex].id;
        llstCharacters[lIndex] = {...prow_SuperHero};           
        this.#storage.setItem('lstCharacters', llstCharacters);      
        return of(llstCharacters[lIndex])
        .pipe(
          delay(1000)
        );        
      }
      return throwError(() => <IModelCharacter>{});
    } catch(e) {
      return throwError(() => <IModelCharacter>{});
    }
  }

  
  deleteSuperHero(pSuperHeroId: number): Observable<IModelCharacter[]> {    
    try {
      const llstCharacters: IModelCharacter[] = this.#storage.getItem('lstCharacters');
      const filteredCharacters: IModelCharacter[] = llstCharacters.filter((lrowCharacter: IModelCharacter) => {
        return lrowCharacter.id !== pSuperHeroId
      });      
      return of(filteredCharacters)
        .pipe(
          map(res => {
            this.#storage.setItem('lstCharacters', res);
            return res
          }),
          delay(1000),
          tap(() =>
            this.#state.set({
              loading: false,
              heroes: filteredCharacters
            })
          )            
        );
    } catch(e) {      
      return throwError(() => <IModelCharacter[]>[]);
    }
  }

  searchSuperHeroes(pTextSearch: string): Observable<IModelCharacter[]> {
    try {
    const llstCharacters: IModelCharacter[] = this.#storage.getItem('lstCharacters');
    const filteredCharacters: IModelCharacter[] = llstCharacters.filter((lHero: IModelCharacter) => {
      return lHero.name.toLowerCase().includes(pTextSearch.toLowerCase());
    });

    return of(filteredCharacters)
      .pipe(
        delay(1000),        
        tap(() =>
          this.#state.set({
            loading: false,
            heroes: filteredCharacters
          })
        )
      );
    } catch(e) {
      return throwError(() => <IModelCharacter[]>[]);
    }
  }

  //TODO: Pass to helper
  private _mapResponse(plst_Characters: any): IModelCharacter[] {    
    return plst_Characters.data.results.map((lrow_Character: any) => {
      return <IModelCharacter> {
        id: lrow_Character.id,
        image: `${lrow_Character.thumbnail.path}.${lrow_Character.thumbnail.extension}`,
        name: lrow_Character.name,
        description: lrow_Character.description
      }
    });    
  }

 //TODO: Pass to helper
  private _getNextId(llstCharacters: IModelCharacter[]): number {
    let lastId: number = 0;
    if (llstCharacters.length > 0) lastId = llstCharacters[llstCharacters.length -1].id;    
    return lastId + 1;
  }
}
