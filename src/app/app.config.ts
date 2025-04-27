import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideAnimations} from '@angular/platform-browser/animations';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withHashLocation,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions
} from '@angular/router';

import {DropdownModule, SidebarModule} from '@coreui/angular';
import {IconSetService} from '@coreui/icons-angular';
import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {authInterceptor} from "./core/interceptors/auth.interceptor";


// @ts-ignore
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload',
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withEnabledBlockingInitialNavigation(),
      withViewTransitions()
    ),
    importProvidersFrom(SidebarModule, DropdownModule),
    IconSetService,
    provideAnimations(),
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
