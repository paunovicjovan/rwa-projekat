import { Actions, createEffect, ofType } from "@ngrx/effects";
import { inject } from '@angular/core'
import { AuthService } from "../services/auth.service";
import * as authActions from './auth.actions';
import * as usersActions from '../../users/state/users.actions'
import { catchError, exhaustMap, map, of, tap } from "rxjs";
import { AuthResponse } from "../models/auth-response.interface";
import { HttpErrorResponse } from "@angular/common/http";
import { TokenPersistenceService } from "../../../core/services/token-persistence.service";
import { Router } from "@angular/router";
import { User } from "../../users/models/user.interface";

export const login$ = createEffect(
    (action$ = inject(Actions), authService = inject(AuthService), tokenPersistanceService = inject(TokenPersistenceService)) => {
        return action$.pipe(
            ofType(authActions.login),
            exhaustMap(({loginRequest}) =>
                authService.login(loginRequest).pipe(
                    map((response: AuthResponse) => {
                        tokenPersistanceService.set('token', response.token!);
                        return authActions.loginSuccess({currentUser: response.user, token: response.token!})
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

export const register$ = createEffect(
    (action$ = inject(Actions), authService = inject(AuthService), tokenPersistanceService = inject(TokenPersistenceService)) => {
        return action$.pipe(
            ofType(authActions.register),
            exhaustMap(({registerRequest}) =>
                authService.register(registerRequest).pipe(
                    map((response: AuthResponse) => {
                        tokenPersistanceService.set('token', response.token!);
                        return authActions.registerSuccess({currentUser: response.user, token: response.token!})
                    }),
                    catchError((errorResponse : HttpErrorResponse) => {
                        return of(authActions.registerFailure({errorMessage: errorResponse.error.message}))
                        }
                    )
                )
            )
        )
    },
    {functional: true}
)


export const redirectAfterLogin$ = createEffect((actions$ = inject(Actions), router = inject(Router))=>{
    return actions$.pipe(
        ofType(authActions.loginSuccess, authActions.registerSuccess),
        map(({currentUser} : {currentUser: User})=>{
            return usersActions.loadUserProfile({userId: currentUser.id})
        }),
        tap(() => {
            router.navigate(['..', 'user-profile'])
        })
    )
}, {
    functional:true
})