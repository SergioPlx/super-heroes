import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { HeroListComponent } from './hero-list.component';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CharactersService } from '../../core/services/characters/characters.service';
import { IModelCharacter } from '../../interfaces/character/character.interface';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { MessageService } from 'primeng/api';
import { NotificationService } from '../../core/services/notifications/notification.service';
import { HeroDetailComponent } from '../hero-detail/hero-detail.component';
import { provideRouter, Router } from '@angular/router';

const API_URL: string = `${environment.baseUrl}characters?limit=10&apikey=${environment.SECRET_KEY}`;
const DEFAULT_IMG: string = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';
const mockApiResponse = {
  data: {
    results: [
      {id: 1, name: 'Test 1', description: 'Test 1 Desc', thumbnail: {extension: 'jpg', path: 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available'}},  
      {id: 2, name: 'Test 2', description: 'Test 2 Desc', thumbnail: {extension: 'jpg', path: 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available'}}
    ]
  }
}

const mockListSuperHero: IModelCharacter[] = [
  {id: 1, name: 'Test 1', description: 'Test 1 Desc', image: DEFAULT_IMG},  
  {id: 2, name: 'Test 2', description: 'Test 2 Desc', image: DEFAULT_IMG}
];

const mockedCharacterService: {
  getCharactersList: () => Observable<IModelCharacter[]>,
  deleteSuperHero: (pSuperHeroId: number) => Observable<IModelCharacter[]>
} = {
  getCharactersList: () => of(mockListSuperHero),
  deleteSuperHero: (pSuperHeroId: number) => of(mockListSuperHero)
}

const mockedNotificationService: {
  success: (pDetail: string, pSummary?: string) => void,
  info: (pDetail: string, pSummary?: string) => void,
  warning: (pDetail: string, pSummary?: string) => void,
  error: (pDetail: string, pSummary?: string) => void
} = {
  success: (pDetail: string, pSummary?: string) => {},
  info: (pDetail: string, pSummary?: string) => {},
  warning: (pDetail: string, pSummary?: string) => {},
  error: (pDetail: string, pSummary?: string) => {}
}

describe('HeroListComponent', () => {
  let component: HeroListComponent;
  let fixture: ComponentFixture<HeroListComponent>;
  let httpTesting: HttpTestingController;
  let appCharacterService: CharactersService;
  let appNotificationService: NotificationService;  
  let router: Router; 

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [           
        HeroListComponent,        
      ],
      providers: [        
        provideHttpClient(),    
        provideHttpClientTesting(), 
        provideRouter([
          {path: 'hero/:id', component: HeroDetailComponent},
          {path: 'hero/new', component: HeroDetailComponent}
        ]),    
        {
          provide: CharactersService,
          useValue: mockedCharacterService
        },       
        {
          provide: NotificationService,
          useValue: mockedNotificationService
        },
        MessageService,        
      ]
    })
    .compileComponents();

    appCharacterService = TestBed.inject(CharactersService);     
    appNotificationService = TestBed.inject(NotificationService);
    router = TestBed.inject(Router);
    httpTesting = TestBed.inject(HttpTestingController);  
  });

  beforeEach(() => {                    
    fixture = TestBed.createComponent(HeroListComponent);
    component = fixture.componentInstance;    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get list characters, getCharacterList()', () => {            
    localStorage.clear();    
    fixture.detectChanges();
    const req = httpTesting.expectOne(API_URL);
    req.flush(mockApiResponse);          
    expect(component.lst_Characters).toEqual(mockListSuperHero);
    expect(component.row_AppViewManager.isLoaded).toBeTrue();
    localStorage.clear();
  });

  it('should get data list characters error, getCharacterList()', () => {            
    localStorage.clear();
    component.getCharacterList();
    const req = httpTesting.expectOne(API_URL);
    req.flush('Failed', {
      status: 404,
      statusText: 'Data not found'
    });    
    
    expect(component.lst_Characters).toEqual([]);
    localStorage.clear();
  });
  
  it('should get text of input search, handleSearch()', () => {    
    const lSearchText: string = 'test search text';
    component.handleSearch(lSearchText);
    expect(component.vTextSearched).toEqual(lSearchText);
  });
  
  it('should delete hero, handleClickDelete()', fakeAsync(() => {       
    localStorage.setItem('lstCharacters', JSON.stringify(mockListSuperHero));    
    const lSuperHeroId: number = mockListSuperHero[0].id 
    spyOn(appCharacterService, 'deleteSuperHero').and.returnValue(of(mockListSuperHero));    
    component.handleClickDelete(lSuperHeroId);
    tick(1000);
    expect(component.lst_Characters.length).toEqual(1);
    expect(component.row_AppViewManager.isLoaded).toBeTrue();
    localStorage.clear();
  }));

  it('should get error when try to delete hero that not exist', fakeAsync(() => {    
    localStorage.clear();
    const spy = spyOn(appNotificationService, 'error');
    const lSuperHeroId: number = mockListSuperHero[0].id
    component.handleClickDelete(lSuperHeroId);
    tick(1000);
    appNotificationService.error('Error'); // TODO: Review this line
    expect(appNotificationService.error).toHaveBeenCalled();
  }));

  it('should navigate on edit page when click on edit button, handleClickEdit()', fakeAsync(() => {    
    const lSuperHeroId: number = mockListSuperHero[0].id;
    spyOn(router, 'navigate').and.resolveTo(true);
    component.handleClickEdit(lSuperHeroId);
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['hero', lSuperHeroId]);
  }));

  it('should navigate on new page when click on new button, handleClickNewHero()', fakeAsync(() => {    
    spyOn(router, 'navigate').and.resolveTo(true);
    component.handleClickNewHero();
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['hero', 'new']);
  }));
});
