import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TextCapitalizeDirective } from '../../directives/text-capitalize/text-capitalize.directive';
import { debounceTime, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'searcher',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    TextCapitalizeDirective
  ],
  templateUrl: './searcher.component.html',
  styleUrl: './searcher.component.css'
})
export class SearcherComponent implements OnInit, OnDestroy {
  
  private debouncer: Subject<string> = new Subject<string>();
  private debouncerSubscription?: Subscription;

  // public vSearchText: string = '';

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

  handleClickSearch(pSearchTearm: string): void {      
    this.debouncer.next(pSearchTearm);
  }
  
  handleClickReset(): void {
    this.debouncer.next('');
  }
}
