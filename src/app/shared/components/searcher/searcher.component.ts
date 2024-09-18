import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'searcher',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
  ],
  templateUrl: './searcher.component.html',
  styleUrl: './searcher.component.css'
})
export class SearcherComponent {
  public vSearchText: string = '';

  @Output() voutput_onSearch: EventEmitter<string> = new EventEmitter();

  handleClickSearch(): void {      
    this.voutput_onSearch.emit(this.vSearchText)
    // this.vSearchText = '';
  }
}
