import { Component, inject } from '@angular/core';
import { SearcherComponent } from '@shared/components/searcher/searcher.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { ToolbarModule } from 'primeng/toolbar'
import { TooltipModule } from 'primeng/tooltip';
import { HeroListComponent } from "../dashboard/pages/hero-list/hero-list.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    MenubarModule,
    SearcherComponent,
    ToolbarModule,
    TooltipModule,
    HeroListComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  private _router: Router = inject(Router);
  
  public vTextSearch: string = '';

  onClickNewHero(): void {
    this._router.navigate(['hero', 'new']);
  }

  onSearch(pTextSearch: string): void {}

}
