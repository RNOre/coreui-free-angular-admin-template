import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import {env} from "../../../../env";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authToken = localStorage.getItem('token');


  let authReq = authToken
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    })
    : req;

  if (req.url.startsWith('http') || req.url.startsWith('./') || req.url.startsWith('/')) {
    return next(req);
  }

  authReq = req.clone({
    url: `${env.host}${req.url}` // Added /api/ prefix
  });


  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        localStorage.removeItem('token');
        router.navigate(['/login']).then();
      }
      return throwError(() => error);
    })
  );
};
