import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SnackbarService } from '../services/snackbar/snackbar.service';
import { catchError, throwError } from 'rxjs';

export const errorHandlingInterceptor: HttpInterceptorFn = (req, next) => {
  const snackbarService = inject(SnackbarService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      snackbarService.openSnackBar(err.error.message);
      return throwError(() => err);
    })
  )
};
