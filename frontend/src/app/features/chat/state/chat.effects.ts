import { inject } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import * as chatsActions from './chat.actions';
import { catchError, map, mergeMap, of } from "rxjs";
import { ChatService } from "../services/chat.service";
import { PaginatedResponse } from "../../../shared/models/paginated-response.interface";
import { Room } from "../models/room.interface";

export const loadRooms$ = createEffect(
    (action$ = inject(Actions), chatsService = inject(ChatService)) => {
        return action$.pipe(
            ofType(chatsActions.connect),
            mergeMap(() =>
                chatsService.loadRooms().pipe(
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