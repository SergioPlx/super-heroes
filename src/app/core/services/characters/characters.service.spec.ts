import { TestBed } from '@angular/core/testing';
import { CharactersService } from './characters.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { IModelCharacter } from '../../../interfaces/character/character.interface';
import { StorageService } from '../storage/storage.service';
import { firstValueFrom, of } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

const mockLstCharacters: IModelCharacter[] = [
  {
    id: 1,
    name: 'Test 1',
    description: 'Test 1 Desc',
    image: ''
  },
  {
    id: 2,
    name: 'Test 2',
    description: 'Test 2 Desc',
    image: ''
  }  
];

const lStorageKey: string = 'lstCharacters';

describe('CharactersService', () => {
  let service: CharactersService;
  let storage: StorageService;
  let httpTest: HttpTestingController;

  beforeEach(() => {    
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        StorageService
      ]
    });

    httpTest = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CharactersService);
    storage = TestBed.inject(StorageService);
  });

  beforeEach(() => {
    storage.setItem(lStorageKey, mockLstCharacters);    
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get heroes by id, getCharacterById()', (done: DoneFn) => {
    const lHeroId: string = '1';
    const lCurrentCharacter: IModelCharacter = mockLstCharacters.find(t => t.id.toString() === lHeroId) || <IModelCharacter>{};
    const getCharacterByIdSpy = spyOn(service, 'getCharacterById');
    getCharacterByIdSpy.and.returnValue(of(lCurrentCharacter));
    
    service.getCharacterById(lHeroId).subscribe((value) => {      
      const llstCharacters: IModelCharacter[] = storage.getItem(lStorageKey);
      const lCurrentCharacter = llstCharacters.find(t => t.id.toString() === lHeroId);
      expect(value).toEqual(<IModelCharacter>lCurrentCharacter);
      done();
    });

    expect(service.getCharacterById).toHaveBeenCalled();        
  });

  it('should add new super hero, postSuperHero()', () => {

  });


});
