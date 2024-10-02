import { Component } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoaderService } from '../../../core/services/loader/loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'loader',
  standalone: true,
  imports: [
    CommonModule,
    ProgressSpinnerModule
  ],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
  constructor(public appLoaderService: LoaderService) {}
}
