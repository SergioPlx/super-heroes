import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {MatButton} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TextCapitalizeDirective } from '../../directives/text-capitalize/text-capitalize.directive';



@Component({
  selector: 'searcher',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,

    MatButton,
    MatInputModule,
    MatIconModule,
    MatFormFieldModule,

    TextCapitalizeDirective
  ],
  templateUrl: './searcher.component.html',
  styleUrl: './searcher.component.css'
})
export class SearcherComponent {
  public vSearchText: string = '';

  @Output() voutput_onSearch: EventEmitter<string> = new EventEmitter();

  handleClickSearch(): void {      
    this.voutput_onSearch.emit(this.vSearchText)
  }
  
  handleClickReset(): void {
    this.vSearchText = '';
    this.handleClickSearch();
  }
}
