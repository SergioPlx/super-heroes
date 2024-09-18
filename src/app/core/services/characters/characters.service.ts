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
  getCharactersList(pOffset: number = 0, pSuperHeroName: string = ''): Observable<IModelCustomResponse> {
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

  getCharacterById(pSuperHeroId: string | null): Observable<IModelCustomResponse> {
    let url: string = `${environment.baseUrl}characters/${pSuperHeroId}?apikey=${environment.SECRET_KEY}`;
    return this._http.get<any[]>(url)
      .pipe(
        map((result: any) => {          
          result.data.results = this._mapResponse(result);
          return result.data
        })
      )
  }

  // TODO: Add create super hero
  postSuperHero(prow_SuperHero: IModelCharacter): Observable<any> {
    return of()
  }

  // TODO: Add update
  updateSuperHero(prow_SuperHero: IModelCharacter): Observable<any> {
    return of()
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
}
