import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UsersService } from "../services/users.service";
import * as usersActions from '../state/users.actions'
import { catchError, exhaustMap, map, of, switchMap } from "rxjs";
import { User } from "../models/user.interface";
import { PaginatedResponse } from "../../../shared/models/paginated-response.interface";

export const loadUserProfile$ = createEffect(
    (action$ = inject(Actions), usersService = inject(UsersService)) => {
        return action$.pipe(
            ofType(usersActions.loadUserProfile),
            exhaustMap(({username}) =>
                usersService.getUser(username).pipe(
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

export const filterUsers$ = createEffect(
    (action$ = inject(Actions), usersService = inject(UsersService)) => {
        return action$.pipe(
            ofType(usersActions.filterUsers),
            switchMap(({filterData}) =>
                usersService.filterUsers(filterData).pipe(
                    map((paginatedUsers: PaginatedResponse<User>) => {
                        return usersActions.filterUsersSuccess({ paginatedUsers })
                    }),
                    catchError(() => {
                        return of(usersActions.filterUsersFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)