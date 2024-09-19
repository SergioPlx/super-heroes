import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearcherComponent } from './searcher.component';

const lText: string = 'heroes searcher';

fdescribe('SearcherComponent', () => {
  let component: SearcherComponent;
  let fixture: ComponentFixture<SearcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearcherComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearcherComponent);
  });

  beforeEach(() => {    
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit search text', ()=> {
    spyOn(component.voutput_onSearch, 'emit');
    component.vSearchText = lText;
    component.handleClickSearch()
    expect(component.voutput_onSearch.emit).toHaveBeenCalled();
  });

  it('should get input group', () => {
    const el = fixture.nativeElement;
    const inputGroup = el.querySelector('p-inputgroup')
    const input = el.querySelector('input');    
    const button = el.querySelector('button');

    expect(input.placeholder).toBe('Search super hero');
    expect(button).toBeTruthy();    
    expect(inputGroup).toBeTruthy();
  });  
});
