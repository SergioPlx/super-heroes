import { Injectable } from '@angular/core';
import { BehaviorSubject, concatMap, finalize, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loaderSubject = new BehaviorSubject<boolean>(false);
  loader$: Observable<boolean> = this.loaderSubject.asObservable();

  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    return of(null)
      .pipe(
        tap(() => this.setOn()),
        concatMap(() => obs$),
        finalize(() => this.setOff())
      );
  }

  setOn(): void {
    this.loaderSubject.next(true);
  }

  setOff(): void {
    this.loaderSubject.next(false);
  }


}
