import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        children: [
            {
                path: 'heroes', 
                title: 'Heroes',
                loadComponent: () => import('./features/dashboard/pages/hero-list/hero-list.component').then(m => m.HeroListComponent)
            },
            {
                path: 'hero/new',
                title: 'New Hero',
                loadComponent: () => import('./features/dashboard/pages/hero-detail/hero-detail.component').then(m => m.HeroDetailComponent)
            },
            {
                path: 'hero/:id', 
                title: 'Edit Hero',
                loadComponent: () => import('./features/dashboard/pages/hero-detail/hero-detail.component').then(m => m.HeroDetailComponent)
            },
            {
                path: '',
                redirectTo: 'heroes',
                pathMatch: 'full'
            }
        ]
    },
    /*{
        path: 'heroes',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    },
    {
        path: 'heroList',        
        loadComponent: () => import('./features/dashboard/pages/hero-list/hero-list.component').then(m => m.HeroListComponent)
    },
    {
        path: 'hero/new',
        loadComponent: () => import('./features/hero-detail/hero-detail.component').then(m => m.HeroDetailComponent)
    },
    {
        path: 'hero/:id',        
        loadComponent: () => import('./features/hero-detail/hero-detail.component').then(m => m.HeroDetailComponent)
    },*/
    { 
        path: '**',         
        loadComponent: () => import('./features/page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent)
    },
];
