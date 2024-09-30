import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IModelCharacter } from '../../../interfaces/character/character.interface';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'character-card-item',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    ConfirmDialogModule
  ],
  providers: [
    ConfirmationService
  ],
  templateUrl: './character-card-item.component.html',
  styleUrl: './character-card-item.component.css'
})
export class CharacterCardItemComponent {

  @Input() vinput_rowCharacter: IModelCharacter = <IModelCharacter>{};
  @Output() voutput_onEdit: EventEmitter<number> = new EventEmitter();
  @Output() voutput_onDelete: EventEmitter<number> = new EventEmitter();

  constructor(
    private _appConfirmationService: ConfirmationService
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
