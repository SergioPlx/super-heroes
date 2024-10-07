import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IModelCharacter } from '@interfaces/character/character.interface';

@Component({
  selector: 'image-uploader',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './image-uploader.component.html',
  styleUrl: './image-uploader.component.css'
})
export class ImageUploaderComponent {

  hero = input<IModelCharacter>();
  onUploadFile = output<string | ArrayBuffer | null>();

  public fileName: any;

  onUpload(pEvent: any): void {       

    const files:File[] = pEvent.target.files;

    let lBase64File: string | ArrayBuffer | null;

    for (let i: number = 0; i < files.length; i++) {
      let lReader: FileReader = new FileReader();
      this.fileName = files[i].name;
      lReader.onload = (e) => {
        
        lBase64File = lReader.result;
        this.onUploadFile.emit(lBase64File);
        // this.formCharacterGroup.patchValue({image: lBase64File});        
        // this.onChangeImage.emit(<heroUpdated>{hero: this.hero(), image: this.formCharacterGroup.value.image});
      }

      lReader.readAsDataURL(pEvent.target.files[i]);
    }
  }

}
