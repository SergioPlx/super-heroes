import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { map, Observable } from 'rxjs';
import { IModelCustomResponse } from '../../../interfaces/customResponse/custom-response.interface';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {

  constructor(private _http: HttpClient) { }


  getCharactersList(pOffset: number = 0, pSuperHeroName: string = ''): Observable<IModelCustomResponse> {
    let url: string = `${environment.baseUrl}characters?offset=${pOffset}&limit=10&apikey=${environment.SECRET_KEY}`;
    if (pSuperHeroName.length > 0) url += `&nameStartsWith=${pSuperHeroName}`;
    return this._http.get<any[]>(url)
      .pipe(
        map((result: any) => result.data
      ));
  }

  getCharacterById(pSuperHeroId: string | null): Observable<IModelCustomResponse> {
    let url: string = `${environment.baseUrl}characters/${pSuperHeroId}?apikey=${environment.SECRET_KEY}`;
    return this._http.get<any[]>(url)
      .pipe(
        map((result: any) => result.data)
      )
  }
}
