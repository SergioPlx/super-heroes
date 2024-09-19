import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { catchError, delay, interval, map, Observable, of, throwError } from 'rxjs';
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
  getCharactersList(): Observable<IModelCharacter[]> {
    let url: string = `${environment.baseUrl}characters?&limit=10&apikey=${environment.SECRET_KEY}`;    
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
        throw []
      })
    );
  }

  getCharacterById(pSuperHeroId: string | null): Observable<IModelCharacter> { 
      let llstCharacters: IModelCharacter[] = this._storage.getItem('lstCharacters');
      let lrow_Character: IModelCharacter = llstCharacters.find((lrowCurrentCharacter: IModelCharacter) => lrowCurrentCharacter.id.toString() === pSuperHeroId) ?? <IModelCharacter>{};
    
      const lHasId = lrow_Character.id ?? null;      
      if (!lHasId) {
        return throwError(() => <IModelCharacter>{});
      }      
      return of(lrow_Character)
        .pipe(          
          delay(1000),
          catchError(err => {
            throw <IModelCharacter>{}
          })
        );
  }
  
  postSuperHero(prow_SuperHero: IModelCharacter): Observable<any> {    
    const llstCharacters: IModelCharacter[] = this._storage.getItem('lstCharacters');
    prow_SuperHero.id = this._getNextId(llstCharacters);
    llstCharacters.push(prow_SuperHero);
    this._storage.setItem('lstCharacters', llstCharacters);
    return of(prow_SuperHero)
      .pipe(
        delay(1000),
        catchError(err => {
          throw <IModelCharacter>{}
        })
      );
  }

  // TODO: Add update
  updateSuperHero(pSuperHeroId: string | null, prow_SuperHero: IModelCharacter): Observable<any> {
    const llstCharacters: IModelCharacter[] = this._storage.getItem('lstCharacters');
    let lIndex = llstCharacters.findIndex((llrowCurrentCharacter: IModelCharacter) => llrowCurrentCharacter.id.toString() === pSuperHeroId);
    
    if (lIndex !== -1) {
      prow_SuperHero.id = llstCharacters[lIndex].id;
      llstCharacters[lIndex] = {...prow_SuperHero};           
      this._storage.setItem('lstCharacters', llstCharacters);      
    } else {
      return throwError(() => <IModelCharacter>{});
    }
    return of(llstCharacters[lIndex])
      .pipe(
        delay(1000),
        catchError(err => {
          throw <IModelCharacter>{}
        })
      );  
  }

  //TODO: Add delete
  deleteSuperHero(pSuperHeroId: number): Observable<any> {
    const llstCharacters: IModelCharacter[] = this._storage.getItem('lstCharacters');
    const filteredCharacters: IModelCharacter[] = llstCharacters.filter((lrowCharacter: IModelCharacter) => {
      return lrowCharacter.id !== pSuperHeroId
    });
    this._storage.setItem('lstCharacters', filteredCharacters);
    return of(filteredCharacters)
      .pipe(
        delay(1000),
        catchError(err => {
          throw <IModelCharacter>{}
        })
      );
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
