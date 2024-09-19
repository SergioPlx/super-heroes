import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { catchError, delay, interval, map, Observable, of } from 'rxjs';
import { IModelCustomResponse } from '../../../interfaces/customResponse/custom-response.interface';
import { IModelCharacter } from '../../../interfaces/character/character.interface';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {

  constructor(
    private _http: HttpClient,
    private _storage: StorageService
  ) { }

  // TODO: Pass object in params against of params
  getCharactersList(pOffset: number = 0, pSuperHeroName: string = ''): Observable<IModelCharacter[]> {
    let url: string = `${environment.baseUrl}characters?offset=${pOffset}&limit=10&apikey=${environment.SECRET_KEY}`;
    if (pSuperHeroName.length > 0) url += `&nameStartsWith=${pSuperHeroName}`;
    return this._http.get<any[]>(url)
      .pipe(
        map((result: any) => {          
          const llstCharacters: IModelCharacter[] = this._storage.getItem('lstCharacters');                    
          if (!llstCharacters || !llstCharacters.length) {
            result.data.results = this._mapResponse(result);
            this._storage.setItem('lstCharacters', result.data.results);
            return result.data.results
          }
          return llstCharacters;
        }
      ),
      catchError(err => {
        // TODO: Intercep errors and how notification
        return []
      })
    );
  }

  getCharacterById(pSuperHeroId: string | null): Observable<IModelCharacter> {
    /*let url: string = `${environment.baseUrl}characters/${pSuperHeroId}?apikey=${environment.SECRET_KEY}`;
    return this._http.get<any[]>(url)
      .pipe(
        map((result: any) => {          
          result.data.results = this._mapResponse(result);
          return result.data
        })
      )*/      
      const llstCharacters: IModelCharacter[] = this._storage.getItem('lstCharacters');
      const lrow_Character: IModelCharacter = llstCharacters.find((lrowCurrentCharacter: IModelCharacter) => lrowCurrentCharacter.id.toString() === pSuperHeroId) ?? <IModelCharacter>{};
      return of(lrow_Character).pipe(delay(1000));
  }
  
  postSuperHero(prow_SuperHero: IModelCharacter): Observable<any> {    
    const llstCharacters: IModelCharacter[] = this._storage.getItem('lstCharacters');
    prow_SuperHero.id = this._getNextId(llstCharacters);
    llstCharacters.push(prow_SuperHero);
    this._storage.setItem('lstCharacters', llstCharacters);
    return of(prow_SuperHero).pipe(delay(1000));
  }

  // TODO: Add update
  updateSuperHero(pSuperHeroId: string | null, prow_SuperHero: IModelCharacter): Observable<any> {
    const llstCharacters: IModelCharacter[] = this._storage.getItem('lstCharacters');
    let lIndex = llstCharacters.findIndex((llrowCurrentCharacter: IModelCharacter) => llrowCurrentCharacter.id.toString() === pSuperHeroId);
    
    console.log(lIndex);
    
    if (lIndex !== -1) {
      prow_SuperHero.id = llstCharacters[lIndex].id;
      llstCharacters[lIndex] = {...prow_SuperHero};      
      this._storage.setItem('lstCharacters', llstCharacters);      
    }
    return of(llstCharacters[lIndex]).pipe(delay(1000));  
  }

  //TODO: Add delete
  deleteSuperHero(pSuperHeroId: number): Observable<any> {
    const llstCharacters: IModelCharacter[] = this._storage.getItem('lstCharacters');
    const filteredCharacters: IModelCharacter[] = llstCharacters.filter((lrowCharacter: IModelCharacter) => {
      return lrowCharacter.id !== pSuperHeroId
    });
    this._storage.setItem('lstCharacters', filteredCharacters);
    return of(filteredCharacters).pipe(delay(1000));
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
    const lastId: number = llstCharacters[llstCharacters.length -1].id;
    return lastId + 1;
  }
}
