import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { HeroDetailComponent } from './hero-detail.component';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { IModelCharacter } from '../../interfaces/character/character.interface';
import { Observable, of } from 'rxjs';
import { CharactersService } from '../../core/services/characters/characters.service';
import { HeroListComponent } from '../hero-list/hero-list.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { CharecterFormComponent } from '../../shared/components/character-form/charecter-form.component';

const DEFAULT_IMG: string = 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';
const mockSuperHero: IModelCharacter = {
  id: 1,
  name: 'Test 1',
  description: 'Test 1 Desc',
  image: DEFAULT_IMG
};
const mockListSuperHero: IModelCharacter[] = [
  {id: 1, name: 'Test 1', description: 'Test 1 Desc', image: DEFAULT_IMG},  
  {id: 2, name: 'Test 2', description: 'Test 2 Desc', image: DEFAULT_IMG}
];

const mockedCharacterService: {
  getCharacterById: () => Observable<IModelCharacter>,  
  updateSuperHero: (pSuperHeroId: number, lrowNewCharacter: IModelCharacter) => Observable<IModelCharacter>
} = {
  getCharacterById: () => of(mockSuperHero),  
  updateSuperHero: (pSuperHeroId: number, lrowNewCharacter: IModelCharacter) => of(mockSuperHero)
}

describe('HeroDetailComponent', () => {
  let component: HeroDetailComponent;
  let childComponent: CharecterFormComponent;
  let fixture: ComponentFixture<HeroDetailComponent>;
  let fixtureChild: ComponentFixture<CharecterFormComponent>;
  let appCharacterService: CharactersService;
  let httpTesting: HttpTestingController;
  let router: Router;

  localStorage.setItem('lstCharacters', JSON.stringify(mockListSuperHero));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeroDetailComponent,
        CharecterFormComponent        
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          {path: 'heroList', component: HeroListComponent}          
        ]),        
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({
              id: '1'
            }))
          }
        },
        {
          provide: CharactersService,
          useValue: mockedCharacterService
        },
        MessageService
      ]
    })
    .compileComponents();
    appCharacterService = TestBed.inject(CharactersService);
    httpTesting = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  beforeEach(() => {    
    fixture = TestBed.createComponent(HeroDetailComponent);
    fixtureChild = TestBed.createComponent(CharecterFormComponent);
    component = fixture.componentInstance;           
    childComponent = fixtureChild.componentInstance;
  });

  it('should create', () => {    
    expect(component).toBeTruthy();
  });

  it('should be a new hero', () => {
    component.vIsNew = true;
    fixture.detectChanges();
    expect(component.vIsNew).toBeTrue();
  })

  it('should get character data, getSuperHero()', fakeAsync(() => { 
    localStorage.setItem('lstCharacters', JSON.stringify(mockListSuperHero));
    fixture.detectChanges();        
    component.getSuperHero();
    tick(1000);
    expect(component.row_SuperHero).toEqual(mockSuperHero);    
    //expect(component.row_ViewManager.isLoaded).toBeTrue();
  }));

  it('should throw error getting character by id that not exist, getSuperHero()', fakeAsync(() => {
    localStorage.clear();
    spyOn(component, 'handleClickBack');
    fixture.detectChanges();
    component.getSuperHero();
    tick(1000);
    expect(component.handleClickBack).toHaveBeenCalled();
  }));

  it('should route back when, handleClickBack()', ()=> {
    spyOn(router, 'navigate').and.resolveTo(true);
    component.handleClickBack();
    expect(router.navigate).toHaveBeenCalledWith(['heroList']);
  });

  it('should click save when edit super hero, handleClickSave()', fakeAsync(() => {
    localStorage.setItem('lstCharacters', JSON.stringify(mockListSuperHero));
    fixture.detectChanges(); 
    fixture.componentInstance.vCtrlCharacterForm = childComponent;
    fixture.componentInstance.vCtrlCharacterForm.formCharacterGroup.patchValue({
      name: mockSuperHero.name,
      description: mockSuperHero.description,
      image: mockSuperHero.description
    });
    
    spyOn(router, 'navigate').and.resolveTo(true);    
    component.handleClickSave();
    tick(1000);
    expect(router.navigate).toHaveBeenCalled();
    expect(component.isValid).toBeTrue();
  }));

  it('should click save when create super hero, handleClickSave()', fakeAsync(() => {
    localStorage.setItem('lstCharacters', JSON.stringify(mockListSuperHero));
    fixture.detectChanges(); 
    component.vIsNew = true;
    fixture.componentInstance.vCtrlCharacterForm = childComponent;
    fixture.componentInstance.vCtrlCharacterForm.formCharacterGroup.patchValue({
      name: mockSuperHero.name,
      description: mockSuperHero.description,
      image: mockSuperHero.description
    });
    
    spyOn(router, 'navigate').and.resolveTo(true);
    
    component.handleClickSave();
    tick(1000);
    expect(router.navigate).toHaveBeenCalled();
  }));

});
