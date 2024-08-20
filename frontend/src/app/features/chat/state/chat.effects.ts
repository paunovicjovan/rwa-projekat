import { inject } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import * as chatsActions from './chat.actions';
import { catchError, concatMap, map, mergeMap, of, switchMap, tap } from "rxjs";
import { ChatService } from "../services/chat.service";
import { PaginatedResponse } from "../../../shared/models/paginated-response.interface";
import { Room } from "../models/room.interface";
import { AuthService } from "../../auth/services/auth.service";

export const connect$ = createEffect(
    (action$ = inject(Actions), chatsService = inject(ChatService), authService = inject(AuthService)) => {
        return action$.pipe(
            ofType(chatsActions.connect),
            tap(() =>
                chatsService.connect(authService.getJwt())
            )
        )
    },
    {functional: true, dispatch: false}
)

export const loadRooms$ = createEffect(
    (action$ = inject(Actions), chatsService = inject(ChatService)) => {
        return action$.pipe(
            ofType(chatsActions.loadRooms),
            tap(({paginationOptions}) =>
                chatsService.loadRooms(paginationOptions)
            )
        )
    },
    {functional: true, dispatch: false}
)

export const acceptRooms$ = createEffect(
    (action$ = inject(Actions), chatsService = inject(ChatService)) => {
        return action$.pipe(
            ofType(chatsActions.connect),
            mergeMap(() =>
                chatsService.getRooms().pipe(
                    map((paginatedRooms: PaginatedResponse<Room>) => {
                        return chatsActions.loadRoomsSuccess({ paginatedRooms })
                    }),
                    catchError(() => {
                        return of(chatsActions.loadRoomsFailure())
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)