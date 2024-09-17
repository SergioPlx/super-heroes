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


  getCharactersList(pOffset: number = 0): Observable<IModelCustomResponse> {
    return this._http.get<any[]>(`${environment.baseUrl}characters?offset=${pOffset}&apikey=${environment.SECRET_KEY}`)
      .pipe(
        map((result: any) => result.data
      ));
  }
}
