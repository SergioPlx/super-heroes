import { Component, DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TextCapitalizeDirective } from "./text-capitalize.directive";
import { By } from "@angular/platform-browser";


@Component({
    standalone: true,
    template: `<input type="text" TextUppercase value='test'/>`
})
class TestTextCapitalizeComponent {}

describe('TextCapitalizeDirective', () => {
    let component: TestTextCapitalizeComponent;
    let fixture: ComponentFixture<TestTextCapitalizeComponent>;
    let inputEl: DebugElement;
    let directive: TextCapitalizeDirective;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
          imports: [
            TestTextCapitalizeComponent,
            TextCapitalizeDirective
          ]
        });      
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TestTextCapitalizeComponent);
        component = fixture.componentInstance;
        inputEl = fixture.debugElement.query(By.css('input'));
        directive = new TextCapitalizeDirective(inputEl);
    });    
    
    it('transform text to capitalize', () => {    
        directive.onInputText()
        fixture.detectChanges();        
        const lTextCapitalize = inputEl.nativeElement.value.at(0).toUpperCase() + inputEl.nativeElement.value.slice(1);
        expect(inputEl.nativeElement.value).toBe(lTextCapitalize);
    });    
});