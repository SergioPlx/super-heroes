import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IModelCharacter } from '../../../interfaces/character/character.interface';

@Component({
  selector: 'character-card',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule
  ],
  templateUrl: './character-card.component.html',
  styleUrl: './character-card.component.css'
})
export class CharacterCardComponent {

  @Input() vinput_rowCharacter: IModelCharacter = <IModelCharacter>{};

  @Output() voutput_onEdit: EventEmitter<number> = new EventEmitter();
  @Output() voutput_onDelete: EventEmitter<number> = new EventEmitter();

  handleClickEdit(pSuperHeroId: number): void {
    this.voutput_onEdit.emit(pSuperHeroId);
  }

  handleClickDelete(pSuperHeroId: number): void {
    this.voutput_onDelete.emit(pSuperHeroId);
  }

  get row_Character(): IModelCharacter {
    return this.vinput_rowCharacter;
  }

}
