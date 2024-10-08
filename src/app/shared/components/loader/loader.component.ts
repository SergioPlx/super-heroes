import { Component, inject } from '@angular/core';
import { LoaderService } from '../../../core/services/loader/loader.service';
import { CommonModule } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
@Component({
  selector: 'loader',
  standalone: true,
  imports: [
    CommonModule,  
    MatProgressSpinnerModule  
  ],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
  appLoaderService: LoaderService = inject(LoaderService);
  
}
