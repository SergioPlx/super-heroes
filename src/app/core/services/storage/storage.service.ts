import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  setItem(pKey: string, pObject: any): void {
    localStorage.setItem(pKey, this._parseObjectToString(pObject));
  }

  getItem(pKey: string): any {
    const lStorageObject: any = localStorage.getItem(pKey);
    return this._parseObjectToJson(lStorageObject);
  }

  private _parseObjectToString(pObject: any): string {
    return JSON.stringify(pObject);
  }

  private _parseObjectToJson(pObjectString: string): any {
    return JSON.parse(pObjectString);
  }
}
