import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'heroList',
        pathMatch: 'full'
    },
    {
        path: 'heroList',        
        loadComponent: () => import('./features/hero-list/hero-list.component').then(m => m.HeroListComponent)
    },
    {
        path: 'hero/new',
        loadComponent: () => import('./features/hero-detail/hero-detail.component').then(m => m.HeroDetailComponent)
    },
    {
        path: 'hero/:id',        
        loadComponent: () => import('./features/hero-detail/hero-detail.component').then(m => m.HeroDetailComponent)
    },
    { 
        path: '**',         
        loadComponent: () => import('./features/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent)
    },
];
