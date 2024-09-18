import { Actions, createEffect, ofType } from "@ngrx/effects";
import { inject } from '@angular/core'
import { AuthService } from "../services/auth.service";
import * as authActions from './auth.actions';
import { catchError, exhaustMap, map, of, tap } from "rxjs";
import { AuthResponse } from "../models/auth-response.interface";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { User } from "../../users/models/user.interface";
import { OpenaiService } from "../../../core/services/openai/openai.service";

export const login$ = createEffect(
    (action$ = inject(Actions), authService = inject(AuthService)) => {
        return action$.pipe(
            ofType(authActions.login),
            exhaustMap(({loginRequest}) =>
                authService.login(loginRequest).pipe(
                    map((response: AuthResponse) => {
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
    (action$ = inject(Actions), authService = inject(AuthService)) => {
        return action$.pipe(
            ofType(authActions.register),
            exhaustMap(({registerRequest}) =>
                authService.register(registerRequest).pipe(
                    map((response: AuthResponse) => {
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


export const redirectAfterLoginOrRegister$ = createEffect((actions$ = inject(Actions), router = inject(Router))=>{
    return actions$.pipe(
        ofType(authActions.loginSuccess, authActions.registerSuccess),
        tap(({currentUser} : {currentUser: User}) => {
            router.navigate(['..', 'users', currentUser.username])
        })
    )
}, {
    functional:true,
    dispatch: false
})

export const redirectAfterLogout$ = createEffect((actions$ = inject(Actions), router = inject(Router))=>{
    return actions$.pipe(
        ofType(authActions.logout),
        tap(() => {
            router.navigateByUrl('/')
        })
    )
}, {
    functional:true,
    dispatch: false
})

export const test$ = createEffect(
    (action$ = inject(Actions), openaiService = inject(OpenaiService)) => {
        return action$.pipe(
            ofType(authActions.test),
            exhaustMap(() =>
                openaiService.test().pipe(
                    map((response: any) => {
                        console.log(response);
                        return authActions.testSuccess()
                    }),
                    catchError((err) => {
                        console.log(err);
                        return of(authActions.testFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)