import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import {env} from "../../../../env";
import {ToastService} from "../services/toast.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authToken = localStorage.getItem('token');

  let authReq = authToken
    ? req.clone({
      setHeaders: {
        Authorization: authToken
      }
    })
    : req;

  const $message = inject(ToastService);
  if (req.url.startsWith('http') || req.url.startsWith('./') || req.url.startsWith('/')) {
//
  }else {
    authReq = authReq.clone({
      url: `${env.host_admin}${req.url}` // Added /api/ prefix
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      console.log(error);
      if (error.status === 401) {
        localStorage.removeItem('token');
        router.navigate(['/login']).then();
      }else {
        $message.setToast({
          title: 'Ошибка',
          text: error.error,
          show: true,
          class: 'error'
        })
      }
      return throwError(() => error);
    })
  );
};
