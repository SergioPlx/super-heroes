import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private _lifeTimeMilliSeconds: number = 6000;

  constructor(
    private _appMessageService: MessageService
  ) { }


  public success(pDetail: string, pSummary?: string): void {
    this._appMessageService.add({
      severity: 'success',
      summary: pSummary,
      detail: pDetail,
      life: this._lifeTimeMilliSeconds
    });
  }

  public info(pDetail: string, pSummary?: string): void {
    this._appMessageService.add({
      severity: 'info',
      summary: pSummary,
      detail: pDetail,
      life: this._lifeTimeMilliSeconds
    });
  }

  public warning(pDetail: string, pSummary?: string): void {
    this._appMessageService.add({
      severity: 'warn',
      summary: pSummary,
      detail: pDetail,
      life: this._lifeTimeMilliSeconds
    });
  }  

  public error(pDetail: string, pSummary?: string): void {
    this._appMessageService.add({
      severity: 'error',
      summary: pSummary,
      detail: pDetail,
      life: this._lifeTimeMilliSeconds
    });
  }  
}
