import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { SearcherComponent } from './searcher.component';
import { By } from '@angular/platform-browser';

const lText: string = 'heroes searcher';

describe('SearcherComponent', () => {
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

  it('should emit search text', fakeAsync(()=> {
    spyOn(component.voutput_onSearch, 'emit');    
    component.handleClickSearch(lText)
    tick(500)
    expect(component.voutput_onSearch.emit).toHaveBeenCalled();
  }));

  it('should get input group', () => {
    const el = fixture.nativeElement;
    const inputGroup = el.querySelector('p-inputgroup')
    const input = el.querySelector('input');    
    expect(input.placeholder).toBe('Search super hero');    
    expect(inputGroup).toBeTruthy();
  });  

  it('should reset filter, handleClickReset()', fakeAsync(() => {    
    spyOn(component.voutput_onSearch, 'emit');
    const el = fixture.nativeElement;        
    component.handleClickReset();
    tick(500);
    expect(component.voutput_onSearch.emit).toHaveBeenCalled();
    expect(component.voutput_onSearch.emit).toHaveBeenCalledWith('');
  }));
});
