import { computed, Injectable, signal } from '@angular/core';
import { BehaviorSubject, concatMap, finalize, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loaderSubject = new BehaviorSubject<boolean>(false);
  // loader$: Observable<boolean> = this.loaderSubject.asObservable();

  private loaderSignal = signal<boolean>(false);
  isLoading = computed(() => this.loaderSignal());

  showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    return of(null)
      .pipe(
        tap(() => this.setOn()),
        concatMap(() => obs$),
        finalize(() => this.setOff())
      );
  }

  setOn(): void {
    this.loaderSignal.set(true);
    // this.loaderSubject.next(true);
  }

  setOff(): void {
    this.loaderSignal.set(false);
    // this.loaderSubject.next(false);
  }


}
