import { Component, Input } from '@angular/core';

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

  get row_Character(): IModelCharacter {
    return this.vinput_rowCharacter;
  }

}
