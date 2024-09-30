import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HeroListComponent } from './hero-list.component';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CharactersService } from '../../core/services/characters/characters.service';
import { IModelCharacter } from '../../interfaces/character/character.interface';
import { MessageService } from 'primeng/api';
import { NotificationService } from '../../core/services/notifications/notification.service';
import { HeroDetailComponent } from '../hero-detail/hero-detail.component';
import { provideRouter, Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';

const DEFAULT_IMG: string = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';

const mockListSuperHero: IModelCharacter[] = [
  {id: 1, name: 'Test 1', description: 'Test 1 Desc', image: DEFAULT_IMG},  
  {id: 2, name: 'Test 2', description: 'Test 2 Desc', image: DEFAULT_IMG}
];

describe('HeroListComponent', () => {
  let component: HeroListComponent;
  let fixture: ComponentFixture<HeroListComponent>;
  let httpTesting: HttpTestingController;
  let appCharacterService: CharactersService;
  let appNotificationService: NotificationService;  
  let router: Router; 
  let storage = {} as any;

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
        MessageService,        
      ]
    })
    .compileComponents();

    router = TestBed.inject(Router);
    httpTesting = TestBed.inject(HttpTestingController);      
  });

  beforeEach(() => {                    
    fixture = TestBed.createComponent(HeroListComponent);
    component = fixture.componentInstance;     
    appCharacterService = fixture.debugElement.injector.get(CharactersService);
    appNotificationService = fixture.debugElement.injector.get(NotificationService);    
    fixture.detectChanges();   
  });

  beforeEach(() => {
    storage = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return storage[key] ?? null
    });

    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      return storage[key] = value;
    });      
    
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get list heroes, getCharacterList()', () => {    
    const lst_Heros: IModelCharacter[] = [];
    const appCharacterServiceSpy = spyOn(appCharacterService, 'getCharactersList')
      .and
      .returnValue(of(lst_Heros));
    component.getCharacterList();
    expect(appCharacterServiceSpy).toHaveBeenCalled();
    expect(component.row_AppViewManager.isLoaded).toBeTrue();
    expect(component.lst_Characters.length).toBe(0);    
  });


  it('should return error on get list heroes, getCharacterList()', () => {
    const newError = new Error('Error to getting heroes list');
    const appCharacterServiceSpy = spyOn(appCharacterService, 'getCharactersList')
      .and
      .callFake(() => {
        return throwError(() => newError)
      });

    spyOn(appNotificationService, 'error').and.callFake((pDetail: string) => {
      return newError.message;
    });

    component.getCharacterList();
    expect(appCharacterServiceSpy).toHaveBeenCalled();
    expect(appNotificationService.error).toHaveBeenCalled();    
  });


  it('should get text of input search, handleSearch()', () => {    
    const lSearchText: string = 'test search text';
    component.handleSearch(lSearchText);
    expect(component.vTextSearched).toEqual(lSearchText);
  });

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

  it('should delete a super hero, handleClickDelete()', () => {
    const appCharacterServiceSpy = spyOn(appCharacterService, 'deleteSuperHero')
      .and
      .returnValue(of(mockListSuperHero));

    spyOn(appNotificationService, 'success').and.callFake((pDetail: string) => {
      return 'Super hero is deleted successfully';
    });

    component.handleClickDelete(mockListSuperHero[0].id);
    expect(appCharacterServiceSpy).toHaveBeenCalled();
    expect(appNotificationService.success).toHaveBeenCalled();
    expect(component.row_AppViewManager.isLoaded).toBeTrue();
  });

  it('should get an error when try to delete a super hero, handleClickDelete()', () => {
    const appCharacterServiceSpy = spyOn(appCharacterService, 'deleteSuperHero')
      .and
      .callFake(() => {
        return throwError(() => new Error('Error deleting super hero'))
      });

    spyOn(appNotificationService, 'error').and.callFake((pDetail: string) => {
      return null;
    });

    spyOn(component, 'getCharacterList').and.callFake(() => {
      return []
    });

    component.handleClickDelete(mockListSuperHero[0].id);
    expect(appCharacterServiceSpy).toHaveBeenCalled();
    expect(appNotificationService.error).toHaveBeenCalled();
    expect(component.getCharacterList).toHaveBeenCalled();
  });

  it('should get error when try to delete hero that not exist', () => {
    spyOn(appNotificationService, 'error').and.callFake(() => {
      return throwError(() => new Error('Error deleting super hero'))
    });
    component.handleClickDelete(100);
    expect(appNotificationService.error).toHaveBeenCalled();
  });
});
