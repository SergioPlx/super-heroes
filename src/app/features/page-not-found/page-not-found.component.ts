import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'page-not-found',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent {

  constructor(
    private _router: Router
  ) {}

  handleClick(): void {
    this._router.navigate(['']);
  }
}
