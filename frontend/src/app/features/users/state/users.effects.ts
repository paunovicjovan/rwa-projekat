import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UsersService } from "../services/users.service";
import * as usersActions from '../state/users.actions'
import { catchError, concatMap, exhaustMap, map, of, switchMap, tap } from "rxjs";
import { User } from "../models/user.interface";
import { PaginatedResponse } from "../../../shared/models/paginated-response.interface";
import { Router } from "@angular/router";
import { SnackbarService } from "../../../core/services/snackbar/snackbar.service";
import { MatDialog } from "@angular/material/dialog";
import { RoleChangeDialogComponent } from "../components/role-change-dialog/role-change-dialog.component";
import { RoleChangeDialogData } from "../models/role-change-dialog-data.interface";
import { noOperation } from "../../../shared/state/shared.actions";
import { PersonalityScore } from "../models/personality-score.interface";

export const loadUserProfile$ = createEffect(
    (action$ = inject(Actions), usersService = inject(UsersService)) => {
        return action$.pipe(
            ofType(usersActions.loadUserProfile),
            switchMap(({username}) =>
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

export const autocompleteUsers$ = createEffect(
    (action$ = inject(Actions), usersService = inject(UsersService)) => {
        return action$.pipe(
            ofType(usersActions.autocompleteUsers),
            switchMap(({filterData}) =>
                usersService.filterUsers(filterData).pipe(
                    map((paginatedUsers: PaginatedResponse<User>) => {
                        return usersActions.autocompleteUsersSuccess({ paginatedUsers })
                    }),
                    catchError(() => {
                        return of(usersActions.autocompleteUsersFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)

export const openRoleChangeDialog$ = createEffect(
    (action$ = inject(Actions), dialog = inject(MatDialog)) => {
        return action$.pipe(
            ofType(usersActions.openRoleChangeDialog),
            exhaustMap(({ dialogData }) => {
                const dialogRef = dialog.open(RoleChangeDialogComponent, { width: '600px', data: dialogData });
                return dialogRef.afterClosed().pipe(
                    concatMap((dialogResult: RoleChangeDialogData) => {
                        if (dialogResult === undefined) 
                            return of(noOperation());

                        return of(usersActions.changeUserRole({ userId: dialogResult.userId, newRole: dialogResult.role }))
                    })
                );
            }
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

export const updateUserData$ = createEffect(
    (action$ = inject(Actions), usersService = inject(UsersService), snackBarService = inject(SnackbarService)) => {
        return action$.pipe(
            ofType(usersActions.updateUserData),
            exhaustMap(({ userData }) =>
                usersService.updateUserData(userData).pipe(
                    map((user: User) => {
                        return usersActions.updateUserDataSuccess({ user })
                    }),
                    catchError(({error}) => {
                        snackBarService.openSnackBar(error.message);
                        return of(usersActions.updateUserDataFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)

export const redirectAfterUsernameUpdateSuccess$ = createEffect((actions$ = inject(Actions), router = inject(Router))=>{
    return actions$.pipe(
        ofType(usersActions.updateUserDataSuccess),
        tap(({user}) => {
            router.navigateByUrl('/users/'+user.username)
        })
    )
}, {
    functional:true,
    dispatch: false
})

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
            exhaustMap(({ newImage }) =>
                usersService.changeUserProfileImage(newImage).pipe(
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

export const applyForProject$ = createEffect(
    (action$ = inject(Actions), usersService = inject(UsersService)) => {
        return action$.pipe(
            ofType(usersActions.applyForProject),
            exhaustMap(({ projectId }) =>
                usersService.applyForProject(projectId).pipe(
                    map(() => {
                        return usersActions.applyForProjectSuccess()
                    }),
                    catchError(() => {
                        return of(usersActions.applyForProjectFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)

export const unenrollUserFromProject$ = createEffect(
    (action$ = inject(Actions), usersService = inject(UsersService)) => {
        return action$.pipe(
            ofType(usersActions.unenrollUserFromProject),
            exhaustMap(({ projectId, userId }) =>
                usersService.unenrollUserFromProject(projectId, userId).pipe(
                    map((user: User) => {
                        return usersActions.unenrollUserFromProjectSuccess({user})
                    }),
                    catchError(() => {
                        return of(usersActions.unenrollUserFromProjectFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)

export const acceptUserInProject$ = createEffect(
    (action$ = inject(Actions), usersService = inject(UsersService)) => {
        return action$.pipe(
            ofType(usersActions.acceptUserInProject),
            concatMap(({ projectId, userId }) =>
                usersService.acceptUserInProject(projectId, userId).pipe(
                    map((user: User) => {
                        return usersActions.acceptUserInProjectSuccess({user})
                    }),
                    catchError(() => {
                        return of(usersActions.acceptUserInProjectFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)

export const loadPersonalityScore$ = createEffect(
    (action$ = inject(Actions), usersService = inject(UsersService)) => {
        return action$.pipe(
            ofType(usersActions.loadPersonalityScore),
            switchMap(() =>
                usersService.loadPersonalityScore().pipe(
                    map((personalityScore: PersonalityScore | null) => {
                        return usersActions.loadPersonalityScoreSuccess({ personalityScore })
                    }),
                    catchError(() => {
                        return of(usersActions.loadPersonalityScoreFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)

export const savePersonalityScore$ = createEffect(
    (action$ = inject(Actions), usersService = inject(UsersService), snackBarService = inject(SnackbarService)) => {
        return action$.pipe(
            ofType(usersActions.savePersonalityScore),
            switchMap(({personalityScore}) =>
                usersService.savePersonalityScore(personalityScore).pipe(
                    map((personalityScore: PersonalityScore) => {
                        snackBarService.openSnackBar('Uspešno ste sačuvali promene.');
                        return usersActions.savePersonalityScoreSuccess({ personalityScore })
                    }),
                    catchError(() => {
                        snackBarService.openSnackBar('Došlo je do greške prilikom čuvanja promena.');
                        return of(usersActions.savePersonalityScoreFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)

export const redirectAfterPersonalityScoreChange$ = createEffect((actions$ = inject(Actions), router = inject(Router))=>{
    return actions$.pipe(
        ofType(usersActions.savePersonalityScoreSuccess),
        tap(({personalityScore}) => {
            router.navigateByUrl('/users/'+personalityScore.user.username)
        })
    )
}, {
    functional:true,
    dispatch: false
})


export const searchSuggestedUsers$ = createEffect(
    (action$ = inject(Actions), usersService = inject(UsersService)) => {
        return action$.pipe(
            ofType(usersActions.searchSuggestedUsers),
            switchMap(() =>
                usersService.searchSuggestedUsers().pipe(
                    map((users: User[]) => {
                        return usersActions.searchSuggestedUsersSuccess({ users })
                    }),
                    catchError(() => {
                        return of(usersActions.searchSuggestedUsersFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)

export const searchUsersByTags$ = createEffect(
    (action$ = inject(Actions), usersService = inject(UsersService)) => {
        return action$.pipe(
            ofType(usersActions.searchUsersByTags),
            switchMap(({paginationOptions, tagsIds}) =>
                usersService.searchUsersByTags(paginationOptions, tagsIds).pipe(
                    map((paginatedUsers: PaginatedResponse<User>) => {
                        return usersActions.searchUsersByTagsSuccess({ paginatedUsers })
                    }),
                    catchError(() => {
                        return of(usersActions.searchUsersByTagsFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)

export const loadSuggestedCollaborators$ = createEffect(
    (action$ = inject(Actions), usersService = inject(UsersService)) => {
        return action$.pipe(
            ofType(usersActions.loadSuggestedCollaborators),
            switchMap(({projectId}) =>
                usersService.loadSuggestedCollaborators(projectId).pipe(
                    map((users: User[]) => {
                        return usersActions.loadSuggestedCollaboratorsSuccess({ users })
                    }),
                    catchError(() => {
                        return of(usersActions.loadSuggestedCollaboratorsFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)

export const loadInvitedUsersForProject$ = createEffect(
    (action$ = inject(Actions), usersService = inject(UsersService)) => {
        return action$.pipe(
            ofType(usersActions.loadInvitedUsersForProject),
            switchMap(({projectId, paginationOptions}) =>
                usersService.loadInvitedUsers(projectId, paginationOptions).pipe(
                    map((paginatedUsers: PaginatedResponse<User>) => {
                        return usersActions.loadInvitedUsersForProjectSuccess({ paginatedUsers })
                    }),
                    catchError(() => {
                        return of(usersActions.loadInvitedUsersForProjectFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)