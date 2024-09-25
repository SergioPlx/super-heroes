import { TestBed } from '@angular/core/testing';
import { CharactersService } from './characters.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { IModelCharacter } from '../../../interfaces/character/character.interface';
import { StorageService } from '../storage/storage.service';
import { firstValueFrom } from 'rxjs';

const DEFAULT_IMG: string = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';
const mockLstCharacters: IModelCharacter[] = [
  {
    id: 1,
    name: 'Test 1',
    description: 'Test 1 Desc',
    image: DEFAULT_IMG
  },
  {
    id: 2,
    name: 'Test 2',
    description: 'Test 2 Desc',
    image: DEFAULT_IMG
  }  
];

const mockResponse: any = {
  data: {
    count: 2,
    limit: 10,
    offset: 0,
    results: [
      {
        name: 'Test 1',
        id: 1,
        thumbnail: {
          extension: 'jpg',
          path: 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available'
        },
        description: 'Test 1 Desc'      
      },
      {
        name: 'Test 2',
        id: 2,
        thumbnail: {
          extension: 'jpg',
          path: 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available'
        },
        description: 'Test 2 Desc'      
      }
    ],  
    total: 2
  }
}

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


  it('should get character list, getCharactersList()', async() => {
    localStorage.clear();      
    const characterList = service.getCharactersList();
    const configPromise = firstValueFrom(characterList);
    const req = httpTest.expectOne({method: 'GET'});    
    req.flush(mockResponse);
    expect(await configPromise).toEqual(mockLstCharacters);  
  });

  it('should get character list from cache, getCharactersList()', async() => {
    storage.setItem(lStorageKey, mockLstCharacters);
    const characterList = service.getCharactersList();
    const configPromise = firstValueFrom(characterList);
    const req = httpTest.expectOne({method: 'GET'});    
    req.flush(mockResponse);
    expect(await configPromise).toEqual(mockLstCharacters);  
  });

  it('should get heroes by id, getCharacterById()', (done: DoneFn) => {  
    storage.setItem(lStorageKey, mockLstCharacters);
    service.getCharacterById('1').subscribe((lrowModelCharacter: IModelCharacter) => {
      expect(lrowModelCharacter).toEqual(mockLstCharacters[0]);
      done();
    });
  });

  it('should get error using wrong Id to get character by id, getCharacterById', (done: DoneFn) => {
    const lHeroId: string = '3';
    service.getCharacterById(lHeroId).subscribe({
      next: () => {},
      error: (e) => {
        expect(e).toEqual(<IModelCharacter>{})
        done();
      }
    })
  });

  it('should save a super hero, postSuperHero()', (done: DoneFn) => {
    storage.setItem(lStorageKey, mockLstCharacters);
    const lNewSuperHero: IModelCharacter = {
      id: 0,
      name: 'Test 3',
      description: 'Desc Test 3',
      image: DEFAULT_IMG
    };

    service.postSuperHero(lNewSuperHero).subscribe((lrowSuperHero: IModelCharacter) => {
      expect(storage.getItem(lStorageKey).length).toBe(3);
      done();
    });
  });

  it('should save new hero when de lst characters is void', (done: DoneFn) => {
    localStorage.clear();
    const lNewSuperHero: IModelCharacter = {
      id: 0,
      name: 'Test 3',
      description: 'Desc Test 3',
      image: DEFAULT_IMG
    };

    service.postSuperHero(lNewSuperHero).subscribe({
      next: (lSuperHero: IModelCharacter) => {
        expect(lSuperHero).toEqual(lNewSuperHero);
        expect(storage.getItem(lStorageKey).length).toBe(1);
        done();
      },
      error: (e) => {
        expect(e).toEqual(<IModelCharacter[]>[])
        done();
      }
    });
  });

  it('should update super hero, updateSuperHero()', (done: DoneFn) => {
    storage.setItem(lStorageKey, mockLstCharacters);
    const lUpdatedSuperHero: IModelCharacter = {
      id: 0,
      name: 'Test 1 updated',
      description: 'Desc Test 1 updated',
      image: DEFAULT_IMG
    };
    service.updateSuperHero(mockLstCharacters[0].id.toString(), lUpdatedSuperHero)
      .subscribe((lupdatedHero: IModelCharacter) => {
        expect(storage.getItem(lStorageKey)[0]).toEqual(lupdatedHero);
        done();
      }
    );
  });

  it('should delete super hero, deleteSuperHero()', (done: DoneFn) => {
    storage.setItem(lStorageKey, mockLstCharacters);
    const lHeroId: number = 1;
    service.deleteSuperHero(lHeroId).subscribe((lstSuperHero: IModelCharacter[]) => {
      expect(lstSuperHero.length).toBeLessThan(mockLstCharacters.length);
      expect(lstSuperHero.length).toBe(1);
      done();
    });
  });
  
});
