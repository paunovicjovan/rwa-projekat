import { Actions, createEffect, ofType } from "@ngrx/effects";
import { inject } from '@angular/core'
import { AuthService } from "../services/auth.service";
import * as authActions from './auth.actions'
import { catchError, exhaustMap, map, of } from "rxjs";
import { LoginResponse } from "../models/login-response.interface";
import { HttpErrorResponse } from "@angular/common/http";

export const login$ = createEffect(
    (action$ = inject(Actions), authService = inject(AuthService)) => {
        return action$.pipe(
            ofType(authActions.login),
            exhaustMap(({loginRequest}) =>
                authService.login(loginRequest).pipe(
                    map((response: LoginResponse) => {
                        localStorage.setItem('token', response.access_token)
                        return authActions.loginSuccess({token: response.access_token})
                    }),
                    catchError((errorResponse : HttpErrorResponse) => {
                        return of(authActions.loginFailure({errorMessage: errorResponse.error.message}))
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)
