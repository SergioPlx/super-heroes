import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';
import { IModelCharacter } from '../../../interfaces/character/character.interface';


const mockListSuperHero: IModelCharacter[] = [
  {id: 1, name: 'Test 1', description: 'Test 1 Desc', image: ''},  
  {id: 2, name: 'Test 2', description: 'Test 2 Desc', image: ''}
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
    service.setItem(lKeyToSaveItem, mockListSuperHero);
    expect(service.getItem(lKeyToSaveItem)).toEqual(mockListSuperHero);    
  });
});
