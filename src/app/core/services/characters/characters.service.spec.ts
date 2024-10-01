import { fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { CharactersService } from './characters.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { IModelCharacter } from '../../../interfaces/character/character.interface';
import { StorageService } from '../storage/storage.service';
import { firstValueFrom, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

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
const lNewSuperHero: IModelCharacter = {
  id: 0,
  name: 'Test 3',
  description: 'Desc Test 3',
  image: DEFAULT_IMG
};

const lStorageKey: string = 'lstCharacters';

const appStorageMocked: {
  getItem: (key: string) => any,
  setItem: (key: string, value: any) => void,
  clear: () => void

} = {
  getItem: (key: string) => {},
  setItem: (key: string, value: any) => {},
  clear: () => {}
}

describe('CharactersService', () => {
  let service: CharactersService;  
  let httpTest: HttpTestingController;      
  let storage = {} as any;

  beforeEach(() => {    
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),                
        {
          provide: StorageService,
          useValue: appStorageMocked
        }        
      ]
    });

    httpTest = TestBed.inject(HttpTestingController);
    service = TestBed.inject(CharactersService);    
    storage = TestBed.inject(StorageService);       
  });
  
  beforeEach(() => {    
    spyOn(storage, 'getItem').and.callFake((key: string) => {
      return storage[key]
    });

    spyOn(storage, 'setItem').and.callFake((key: string, value: any) => {
      return storage[key] = value;
    });        
  });  

  beforeEach(() => {
    storage.clear();
  });

  afterEach(() => {    
    httpTest.verify();      
  });
  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get character list successly, getCharacterList()', () => {         
    storage.setItem(lStorageKey, null);                
    service.getCharactersList().subscribe((response: IModelCharacter[]) => {         
      expect(response).toEqual(mockLstCharacters);
    });
    
    const req = httpTest.expectOne(`${environment.baseUrl}characters?limit=10&apikey=${environment.SECRET_KEY}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);    
  });

  it('get characters when local storage is full, getCharacterList()', () => {    
    storage.setItem(lStorageKey, mockLstCharacters);
    service.getCharactersList().subscribe((response: IModelCharacter[]) => {      
      expect(response).toEqual(mockLstCharacters);
    });
    const req = httpTest.expectOne(`${environment.baseUrl}characters?limit=10&apikey=${environment.SECRET_KEY}`);
    expect(req.request.method).toBe('GET');    
    req.flush(mockLstCharacters);  
  });

  it('should get error from api call, getCharacterList()', () => {             
    service.getCharactersList().subscribe({      
      error: (err) => {
        expect(err.length).toBe(0);
      }
    });
    const req = httpTest.expectOne(`${environment.baseUrl}characters?limit=10&apikey=${environment.SECRET_KEY}`);
    expect(req.request.method).toBe('GET');
    req.error(new ProgressEvent('400'));    
  });

  it('should get heroes by id, getCharacterById()', (done: DoneFn) => {      
    storage.setItem(lStorageKey, mockLstCharacters);
    const lHeroId: string = mockLstCharacters[0].id.toString(); 
    service.getCharacterById(lHeroId).subscribe((lrowModelCharacter: IModelCharacter) => {
      expect(lrowModelCharacter).toEqual(mockLstCharacters[0]);      
      done();
    });
  });

  it('should return an error when hero Id not exists, getCharacterById()', () => {        
    const lHeroId: string = '100';
    storage.setItem(lStorageKey, mockLstCharacters);
    service.getCharacterById(lHeroId).subscribe({
      error: (err) => {                
        expect(err).toEqual(<IModelCharacter>{});
        expect(err.id).toBeUndefined();        
      }
    });    
  });

  it('should return an error there is an error on process data, getCharacterById()', () => {     
    const lHeroId: string = mockLstCharacters[0].id.toString();    
    storage.setItem(lStorageKey, null);
    service.getCharacterById(lHeroId).subscribe({
      error: (err) => {
        expect(err).toEqual(<IModelCharacter>{});
        expect(err.id).toBeUndefined();
      }
    });
  });

  it('should save a new Super Hero, postSuperHero()', (done: DoneFn) => {
    storage.setItem(lStorageKey, null);            
    service.postSuperHero(lNewSuperHero).subscribe(response => {
      expect(response).toEqual(lNewSuperHero);
      done();
    });      
  });

  it('should add new super hero, postSuperHero()', (done: DoneFn) => {    
    storage.setItem(lStorageKey, []);
    service.postSuperHero(lNewSuperHero).subscribe(response => {
      expect(storage.getItem(lStorageKey).length).toBe(1);
      expect(response).toEqual(lNewSuperHero);
      done();
    });      
  });

  it('should get error when save new super hero, postSuperHero()', (done: DoneFn) => {        
    storage.setItem(lStorageKey, 'list');
    service.postSuperHero(lNewSuperHero).subscribe({
      error: (err) => {        
        expect(err.id).toBeUndefined();        
        done();
      }
    })
  });

  it('should update super hero, updateSuperHero()', (done: DoneFn) => {             
    storage.setItem(lStorageKey, mockLstCharacters);    
    const lHeroId: string = '1'
    service.updateSuperHero(lHeroId, mockLstCharacters[0]).subscribe(response => {            
      expect(response).toEqual(mockLstCharacters[0]);                        
      done();
    });
  });

  it('should try to update hero that not exists and throw exception, updateSuperHero()', (done: DoneFn) => {
    storage.setItem(lStorageKey, mockLstCharacters);    
    const lHeroId: string = '100'
    service.updateSuperHero(lHeroId, mockLstCharacters[0]).subscribe({
      error: (err) => {        
        expect(err.id).toBeUndefined();
        done();
      }
    });
  });

  it('should try to update hero that not exists and throw exception, updateSuperHero()', (done: DoneFn) => {
    storage.setItem(lStorageKey, null);    
    const lHeroId: string = '1'
    service.updateSuperHero(lHeroId, lNewSuperHero).subscribe({
      error: (err) => {
        expect(err.id).toBeUndefined();
        done();
      }
    });
  });

  it('should delete super hero, deleteSuperHero()', (done: DoneFn) => {
    storage.setItem(lStorageKey, mockLstCharacters);    
    service.deleteSuperHero(mockLstCharacters[0].id).subscribe(response => {
      expect(response.length).toBe(1);
      done();
    });
  });
  it('should try to delete super hero that not exists, deleteSuperHero()', (done: DoneFn) => {
    storage.setItem(lStorageKey, null);    
    service.deleteSuperHero(100).subscribe({
      error: (err) => {
        expect(err.length).toBe(0);
        done();
      }
    });
  });
});
