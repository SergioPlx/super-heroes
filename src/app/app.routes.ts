import { Routes } from '@angular/router';
import { HeroListComponent } from './features/hero-list/hero-list.component';
import { HeroDetailComponent } from './features/hero-detail/hero-detail.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'heroList',
        pathMatch: 'full'
    },
    {
        path: 'heroList',
        component: HeroListComponent
    },
    {
        path: 'hero/new',
        component: HeroDetailComponent
    },
    {
        path: 'hero/:id',
        component: HeroDetailComponent
    }

];
