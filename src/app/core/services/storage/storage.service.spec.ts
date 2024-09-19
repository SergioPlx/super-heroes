import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';
import { IModelCharacter } from '../../../interfaces/character/character.interface';


const mockListObject: IModelCharacter[] = [
  {
    id: 1,
    name: 'object 1',
    description: 'description 1',
    image: ''
  },
  {
    id: 2,
    name: 'object 2',
    description: 'description 2',
    image: ''
  },  
];

const lKeyToSaveItem: string = 'lstCharacters';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set item on storage', () => {    
    service.setItem(lKeyToSaveItem, mockListObject);
    expect(service.getItem(lKeyToSaveItem)).toEqual(mockListObject);    
  });
});
