import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {RouterOutlet} from '@angular/router';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { SidemenuComponent } from '@shared/components/sidemenu/sidemenu.component';
import {TitleComponent} from '@shared/components/title/title.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    LoaderComponent,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,  
    SidemenuComponent,  
    RouterOutlet,
    TitleComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  


}
