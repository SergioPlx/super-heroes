import { Pipe, PipeTransform } from '@angular/core';
import { IModelCharacter } from '../../../interfaces/character/character.interface';

@Pipe({
  name: 'valueFilter',
  standalone: true
})
export class ValueFilterPipe implements PipeTransform {

  transform(lst_Items: unknown[], pKey: string, pValue: string): any {
    console.log('launched');    
    if (lst_Items.length > 0) {
      const lValue: string = pValue.toLocaleLowerCase()
      return lst_Items.filter((lrow_Item: any) => {    
        const lPropertyValue: string = lrow_Item[pKey].toLocaleLowerCase();
        return lPropertyValue.indexOf(lValue) !== -1
      })
    }
    return lst_Items;
  }

}
