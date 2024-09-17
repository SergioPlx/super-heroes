import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {

  constructor(private _http: HttpClient) { }


  getCharactersList(): Observable<any[]> {
    return this._http.get<any[]>(`${environment.baseUrl}characters?apikey=${environment.SECRET_KEY}`)
      .pipe(
        map((result: any) => result.data
      ));
  }
}
