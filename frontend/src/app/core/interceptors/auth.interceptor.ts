import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  
  // Obtenemos el token desde donde se haya guardado durante el login
  const token = localStorage.getItem('token'); 

  let authReq = req;
  
  // Si hay token, clonamos la petición y le agregamos el header Authorization
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Continuamos con la petición interceptada
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el backend dice "401 No Autorizado", el token expiró o es inválido
      if (error.status === 401) {
        localStorage.removeItem('token'); // Limpiamos la sesión
        router.navigate(['/login']); // Lo pateamos al login
      }
      return throwError(() => error);
    })
  );
};
