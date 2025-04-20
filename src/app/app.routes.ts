import {Routes} from '@angular/router';
import {DefaultLayoutComponent} from './layout';
import {InviteLegalComponent} from "./views/pages/invite-legal/invite-legal.component";
import {OrderComponent} from "./views/order/order/order.component";
import {TariffComponent} from "./views/billing/tariff/tariff.component";
import {OrderCreateComponent} from "./views/order/order-create/order-create.component";
import {OrderItemComponent} from "./views/order/order-item/order-item.component";
import {CompanyComponent} from "./views/company/company.component";
import {CompanyPageComponent} from "./views/company/company-page/company-page.component";
import {LicenseComponent} from "./views/billing/license/license.component";
import {MainPageComponent} from "./views/main-page/main-page.component";
import {UserComponent} from "./views/user/user.component";
import {UserPageComponent} from "./views/user/user-page/user-page.component";
import {authGuard} from "./guard/auth.guard";
import {MainPageLegalComponent} from "./views/main-page/main-page-legal/main-page-legal.component";
import {AnalysisPageComponent} from "./views/analysis-page/analysis-page.component";
import {UserLegalComponent} from "./views/user-legal/user-legal.component";
import {AnalysisItemComponent} from "./views/analysis-item/analysis-item.component";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    canActivate: [authGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'billing',
        children: [
          {
            path: 'tariffs',
            component: TariffComponent
          },
          {
            path: 'licenses',
            component: LicenseComponent
          }
        ]
      },
      {
        path: 'order',
        component: OrderComponent,
      },
      {
        path: 'order/:id',
        component: OrderItemComponent
      },
      {
        path: 'company',
        component: CompanyComponent,
      },
      {
        path: 'company/:id',
        component: CompanyPageComponent

      },
      {
        path: 'home',
        component: MainPageComponent
      },
      {
        path: 'user',
        component: UserComponent
      },
      {
        path: 'user/:id',
        component: UserPageComponent
      },
      {
        path: 'main-legal',
        component: MainPageLegalComponent
      },
      {
        path: 'user-legal',
        component: UserLegalComponent
      },
      {
        path: 'analysis',
        component: AnalysisPageComponent
      },
      {
        path: 'analysis/:id',
        component: AnalysisItemComponent
      }
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  {
    path: 'invite-legal',
    component: InviteLegalComponent
  },
  {
    path: 'order-create',
    component: OrderCreateComponent
  },
  {path: '**', redirectTo: 'dashboard'}
];
