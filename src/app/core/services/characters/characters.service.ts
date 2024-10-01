import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { catchError, delay, map, Observable, of, throwError } from 'rxjs';
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

  getCharactersList(): Observable<IModelCharacter[]> {
    let url: string = `${environment.baseUrl}characters?limit=10&apikey=${environment.SECRET_KEY}`;    
    return this._http.get<any[]>(url)
      .pipe(
        map((result: any) => {                  
          const llstCharacters: IModelCharacter[] = this._storage.getItem('lstCharacters');                      
          if (!llstCharacters || !llstCharacters.length) {            
            const llsMappedCharacters: IModelCharacter[] = this._mapResponse(result);
            this._storage.setItem('lstCharacters', llsMappedCharacters);
            return llsMappedCharacters
          }

          return llstCharacters;
        }
      ),
      catchError(err => {
        throw <IModelCharacter[]>[];
      })
    );
  }

  getCharacterById(pSuperHeroId: string | null): Observable<IModelCharacter> { 
    try {
      let llstCharacters: IModelCharacter[] = this._storage.getItem('lstCharacters');
      let lrow_Character: IModelCharacter = llstCharacters.find((lrowCurrentCharacter: IModelCharacter) => lrowCurrentCharacter.id.toString() === pSuperHeroId) ?? <IModelCharacter>{};    
      const lHasId = lrow_Character.id ?? null;  
      if (!lHasId) {
        return throwError(() => <IModelCharacter>{});
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
      let llstCharacters: IModelCharacter[] = this._storage.getItem('lstCharacters');

      if (!llstCharacters) llstCharacters = <IModelCharacter[]>[];

      prow_SuperHero.id = this._getNextId(llstCharacters);
      llstCharacters.push(prow_SuperHero);
      this._storage.setItem('lstCharacters', llstCharacters);
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
      const llstCharacters: IModelCharacter[] = this._storage.getItem('lstCharacters');  
      let lIndex = llstCharacters.findIndex((llrowCurrentCharacter: IModelCharacter) => llrowCurrentCharacter.id.toString() === pSuperHeroId);
      
      if (lIndex !== -1) {
        prow_SuperHero.id = llstCharacters[lIndex].id;
        llstCharacters[lIndex] = {...prow_SuperHero};           
        this._storage.setItem('lstCharacters', llstCharacters);      
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
      const llstCharacters: IModelCharacter[] = this._storage.getItem('lstCharacters');
      const filteredCharacters: IModelCharacter[] = llstCharacters.filter((lrowCharacter: IModelCharacter) => {
        return lrowCharacter.id !== pSuperHeroId
      });      
      return of(filteredCharacters)
        .pipe(
          map(res => {
            this._storage.setItem('lstCharacters', res)
            return res
          }),
          delay(1000)
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
