import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';




@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  
  #snackBar = inject(MatSnackBar);
  #snackBarConfig: MatSnackBarConfig = <MatSnackBarConfig>{
    horizontalPosition: 'right',
    verticalPosition: 'top',
    duration: 5000
  }

  constructor() { }


  public show(pDetail: string, pSummary?: string): void {
    this.#snackBar.open(pDetail, pSummary, this.#snackBarConfig)
  }

}
