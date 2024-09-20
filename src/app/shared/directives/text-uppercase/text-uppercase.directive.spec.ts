import { Component, DebugElement, ElementRef, inject } from '@angular/core';
import { TextUppercaseDirective } from './text-uppercase.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  standalone: true,
  template: `<input type="text" TextUppercase value='test'/>`
})
class TestTextUppercaseComponent{}

fdescribe('TextUppercaseDirective', () => {  
  let component: TestTextUppercaseComponent;
  let fixture: ComponentFixture<TestTextUppercaseComponent>;
  let inputEl: DebugElement;
  let directive: TextUppercaseDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TextUppercaseDirective,
        TestTextUppercaseComponent
      ]
    });      
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestTextUppercaseComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input'));
    directive = new TextUppercaseDirective(inputEl);
  })

  it('transform text to uppercase', () => {    
    directive.onInputText()
    fixture.detectChanges();
    const lTextUpper = inputEl.nativeElement.value;    
    expect(inputEl.nativeElement.value).toBe(lTextUpper.toUpperCase());
  });
});
