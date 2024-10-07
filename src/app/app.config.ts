import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpInterceptor } from './core/interceptors/http.interceptor';
import { LoaderService } from './core/services/loader/loader.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(
      routes,
      withViewTransitions(),
    ),
    provideAnimations(),
    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch()
    ),
    LoaderService,
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptor, multi: true}, provideAnimationsAsync(),
  ]
};
