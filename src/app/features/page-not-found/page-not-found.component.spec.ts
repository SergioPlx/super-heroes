import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageNotFoundComponent } from './page-not-found.component';
import { Router } from '@angular/router';

// TODO: Replace router with router testing
describe('PageNotFoundComponent', () => {
  let component: PageNotFoundComponent;
  let fixture: ComponentFixture<PageNotFoundComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageNotFoundComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNotFoundComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should route to parent path when click button, handleClick()', () => {
    spyOn(router, 'navigate');
    component.handleClick();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should has a button to return home', () => {
    const lButtonHome = fixture.nativeElement.querySelector('p-button');
    expect(lButtonHome).toBeTruthy();
  });

  it('should has message not found', () => {
    const lMessageText = fixture.nativeElement.querySelector('.text-message');    
    expect(lMessageText.textContent).toEqual('PAGE NOT FOUND');
  })
});
