import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UsersService } from "../services/users.service";
import * as usersActions from '../state/users.actions'
import { catchError, exhaustMap, map, of } from "rxjs";
import { User } from "../models/user.interface";

export const loadUserProfile$ = createEffect(
    (action$ = inject(Actions), usersService = inject(UsersService)) => {
        return action$.pipe(
            ofType(usersActions.loadUserProfile),
            exhaustMap(({userId}) =>
                usersService.getUser(userId).pipe(
                    map((user: User) => {
                        return usersActions.loadUserProfileSuccess({loadedUser: user})
                    }),
                    catchError(() => {
                        return of(usersActions.loadUserProfileFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)