import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpInterceptor } from './core/interceptors/http.interceptor';
import { LoaderService } from './core/services/loader/loader.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptorsFromDi(),
      withFetch()
    ),
    LoaderService,
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptor, multi: true},
  ]
};
