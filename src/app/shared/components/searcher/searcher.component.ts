import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { TextCapitalizeDirective } from '../../directives/text-capitalize/text-capitalize.directive';
import { debounceTime, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'searcher',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,    
    TextCapitalizeDirective
  ],
  templateUrl: './searcher.component.html',
  styleUrl: './searcher.component.css'
})
export class SearcherComponent implements OnInit, OnDestroy {
  
  private debouncer: Subject<string> = new Subject<string>();
  private debouncerSubscription?: Subscription;

  public vSearchText: string = '';

  @Output() voutput_onSearch: EventEmitter<string> = new EventEmitter();

  ngOnInit(): void {
    this.debouncerSubscription = this.debouncer
    .pipe(
      debounceTime(500)
    ).subscribe(value => this.voutput_onSearch.emit(value))    
  }

  ngOnDestroy(): void {
    this.debouncerSubscription?.unsubscribe();
  }

  handleClickSearch(searchTerm: string): void {      
    this.debouncer.next(searchTerm);    
  }
  
  handleClickReset(): void {
    this.voutput_onSearch.emit('');    
  }
}
