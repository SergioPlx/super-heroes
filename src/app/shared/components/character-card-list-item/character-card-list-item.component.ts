import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IModelCharacter } from '../../../interfaces/character/character.interface';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'character-card-list-item',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    CardModule,
    ConfirmDialogModule
  ],
  providers: [
    ConfirmationService, 
    MessageService
  ],
  templateUrl: './character-card-list-item.component.html',
  styleUrl: './character-card-list-item.component.css'
})
export class CharacterCardListItemComponent {

  @Input() vinput_rowCharacter: IModelCharacter = <IModelCharacter>{};

  @Output() voutput_onEdit: EventEmitter<number> = new EventEmitter();
  @Output() voutput_onDelete: EventEmitter<number> = new EventEmitter();

  constructor(
    private _appConfirmationService: ConfirmationService,
    private _appMessageService: MessageService,
  ) {}


  handleClickEdit(pSuperHeroId: number): void {
    this.voutput_onEdit.emit(pSuperHeroId);
  }

  handleClickDelete(pEvent: Event, pSuperHeroId: number): void {
    this._appConfirmationService.confirm({
      target: pEvent.target as EventTarget,
            message: 'Are you sure that you want to proceed?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon:"none",
            rejectIcon:"none",
            rejectButtonStyleClass:"p-button-text",
            accept: () => {
                this.voutput_onDelete.emit(pSuperHeroId);
            },
            reject: () => {
                // this._appMessageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
            }
    });   
  }

  get row_Character(): IModelCharacter {
    return this.vinput_rowCharacter;
  }

}
