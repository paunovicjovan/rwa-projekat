import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UsersService } from "../services/users.service";
import * as usersActions from '../state/users.actions'
import { catchError, exhaustMap, map, of, switchMap, tap } from "rxjs";
import { User } from "../models/user.interface";
import { PaginatedResponse } from "../../../shared/models/paginated-response.interface";
import { Router } from "@angular/router";

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

export const changeUserRole$ = createEffect(
    (action$ = inject(Actions), usersService = inject(UsersService)) => {
        return action$.pipe(
            ofType(usersActions.changeUserRole),
            exhaustMap(({ userId, newRole }) =>
                usersService.changeUserRole(userId, newRole).pipe(
                    map((user: User) => {
                        return usersActions.changeUserRoleSuccess({ user })
                    }),
                    catchError(() => {
                        return of(usersActions.changeUserRoleFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)

export const deleteUserAccount$ = createEffect(
    (action$ = inject(Actions), usersService = inject(UsersService)) => {
        return action$.pipe(
            ofType(usersActions.deleteUserAccount),
            exhaustMap(({ userId }) =>
                usersService.deleteOne(userId).pipe(
                    map(() => {
                        return usersActions.deleteUserAccountSuccess({ userId })
                    }),
                    catchError(() => {
                        return of(usersActions.deleteUserAccountFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)

export const redirectAfterDeleteSuccess$ = createEffect((actions$ = inject(Actions), router = inject(Router))=>{
    return actions$.pipe(
        ofType(usersActions.deleteUserAccountSuccess),
        tap(() => {
            router.navigateByUrl('/users')
        })
    )
}, {
    functional:true,
    dispatch: false
})

export const changeUserProfileImage$ = createEffect(
    (action$ = inject(Actions), usersService = inject(UsersService)) => {
        return action$.pipe(
            ofType(usersActions.changeUserProfileImage),
            exhaustMap(({ formData }) =>
                usersService.changeUserProfileImage(formData).pipe(
                    map((user: User) => {
                        return usersActions.changeUserProfileImageSuccess({ user })
                    }),
                    catchError(() => {
                        return of(usersActions.changeUserProfileImageFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)

export const loadAppliedUsersForProject$ = createEffect(
    (action$ = inject(Actions), usersService = inject(UsersService)) => {
        return action$.pipe(
            ofType(usersActions.loadAppliedUsersForProject),
            switchMap(({ projectId, paginationOptions }) =>
                usersService.loadAppliedUsersForProject(projectId, paginationOptions).pipe(
                    map((paginatedUsers: PaginatedResponse<User>) => {
                        return usersActions.loadAppliedUsersForProjectSuccess({ paginatedUsers })
                    }),
                    catchError(() => {
                        return of(usersActions.loadAppliedUsersForProjectFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)

export const loadAcceptedUsersForProject$ = createEffect(
    (action$ = inject(Actions), usersService = inject(UsersService)) => {
        return action$.pipe(
            ofType(usersActions.loadAcceptedUsersForProject),
            switchMap(({ projectId, paginationOptions }) =>
                usersService.loadAcceptedUsersForProject(projectId, paginationOptions).pipe(
                    map((paginatedUsers: PaginatedResponse<User>) => {
                        return usersActions.loadAcceptedUsersForProjectSuccess({ paginatedUsers })
                    }),
                    catchError(() => {
                        return of(usersActions.loadAcceptedUsersForProjectFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)