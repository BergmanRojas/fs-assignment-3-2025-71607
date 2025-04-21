import { HttpInterceptorFn, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { ErrorHandlerService } from './error-handler.service'; // Adjust the path as necessary

export const errorInterceptor: HttpInterceptorFn = (req, next: HttpHandlerFn) => {
  const errorHandlerService = inject(ErrorHandlerService);

  return next(req).pipe(
    catchError((error) => {
      console.error("Caught in errorInterceptor", error.message);
      if (error instanceof HttpErrorResponse) {
        errorHandlerService.handleHttpError(error);
      }
      return throwError(() => error);
    })
  );
};
