import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { HeroListComponent } from './hero-list.component';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CharactersService } from '../../core/services/characters/characters.service';
import { IModelCharacter } from '../../interfaces/character/character.interface';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { MessageService } from 'primeng/api';

const mockListSuperHero: IModelCharacter[] = [
  {id: 1, name: 'Test 1', description: 'desc1', image: ''}  
];

const mockedCharacterService: {
  getCharactersList: () => Observable<IModelCharacter[]>
} = {
  getCharactersList: (pOffset: number = 0, pSuperHeroName: string = '') => of(mockListSuperHero)
}


describe('HeroListComponent', () => {
  let component: HeroListComponent;
  let fixture: ComponentFixture<HeroListComponent>;
  let httpTestClient: HttpTestingController;
  let appCharacterService: CharactersService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [           
        HeroListComponent
      ],
      providers: [        
        provideHttpClient(),    
        provideHttpClientTesting(),     
        {
          provide: CharactersService,
          useValue: mockedCharacterService
        },
        MessageService
      ]
    })
    .compileComponents();

    httpTestClient = TestBed.inject(HttpTestingController);  
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroListComponent);
    component = fixture.componentInstance;
    appCharacterService = TestBed.inject(CharactersService);
    // fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get list characters, getCharacterList()', () => {          
      const url = `${environment.baseUrl}characters?offset=0&limit=10&apikey=${environment.SECRET_KEY}`;
      fixture.detectChanges();              
      // const req = httpTestClient.expectOne(url);
      // req.flush(mockListSuperHero);
      // expect(component.lst_Characters).toBeTruthy();      
      expect(component.vIsLoaded).toBeFalse();
      // httpTestClient.verify();
  });

  it('should get text of input search, handleSearch()', () => {
    const lSearchText: string = 'test search text';
    component.handleSearch(lSearchText);
    expect(component.vTextSearched).toEqual(lSearchText);
  });  
});
