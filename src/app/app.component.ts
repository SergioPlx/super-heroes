import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { LoaderService } from './core/services/loader/loader.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    LoaderComponent,
    ToastModule,
    RouterOutlet
  ],
  providers: [
    MessageService,     
    LoaderService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'super-heroes';
}
