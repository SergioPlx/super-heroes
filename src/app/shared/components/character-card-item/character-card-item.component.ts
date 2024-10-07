import { Component, inject, input, output} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { IModelCharacter } from '../../../interfaces/character/character.interface';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'character-card-item',
  standalone: true,
  imports: [    
    MatButtonModule,
    MatCardModule,
  ],
  providers: [],
  templateUrl: './character-card-item.component.html',
  styleUrl: './character-card-item.component.css'
})
export class CharacterCardItemComponent {
 
  hero = input.required<IModelCharacter>();
  onEdit = output<number>();
  onDelete = output<number>()

  readonly dialog = inject(MatDialog);

  constructor() {}

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        hero: this.hero()
      },
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
    });

    dialogRef.afterClosed().subscribe((result: IModelCharacter) => {
      if(result !== undefined) {
        this.onDelete.emit(result.id);
      }
    });
  }

  handleClickEdit(pSuperHeroId: number): void {    
    this.onEdit.emit(pSuperHeroId);
  }
}
