import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [],
  template: `<h3 [class]="cssClass">{{text}}</h3>`,
  styleUrl: './title.component.css'
})
export class TitleComponent {

  @Input({required: true}) text!: string;
  @Input() cssClass!: string;

}
