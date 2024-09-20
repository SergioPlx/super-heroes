import { IModelCharacter } from '../../../interfaces/character/character.interface';
import { ValueFilterPipe } from './value-filter.pipe';

describe('ValueFilterPipe', () => {

  const pipe = new ValueFilterPipe();
  const lstItems: IModelCharacter[] = [
    {
      id: 1,
      name: 'Test 1',
      description: 'Test 1 description',
      image: ''
    },
    {
      id: 2,
      name: 'Character 2',
      description: 'Character 2 description',
      image: ''
    }
  ];

  const lstVoidItems: IModelCharacter[] = [];
  
  it('create an instance', () => {    
    expect(pipe).toBeTruthy();
  });

  it('should get value from array', () => {
    const lNameToSearch: string = 'Test';
    expect(pipe.transform(lstItems, 'name', lNameToSearch).length).toBe(1);
  });

  it('without text search should return all items', () => {
    const lNameToSearch: string = '';
    expect(pipe.transform(lstItems, 'name', lNameToSearch).length).toBe(lstItems.length);
  })

  it('should return all items', () => {
    const lNameToSearch: string = 'Test';
    expect(pipe.transform(lstVoidItems, 'name', 'lNameToSearch').length).toBe(lstVoidItems.length);
  })
});
