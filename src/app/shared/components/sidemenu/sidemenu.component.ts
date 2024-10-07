import { Component } from '@angular/core';
import { routes } from '../../../app.routes';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'sidemenu',
  standalone: true,
  imports: [
    RouterModule,
    MatListModule,
  ],
  templateUrl: './sidemenu.component.html',
  styleUrl: './sidemenu.component.css'
})
export class SidemenuComponent {
  public menuItems = routes
  .map( route => route.children ?? [])
  .flat()
  .filter(route => route && route.path)
  .filter(route => !route.path?.includes(':'));
}
