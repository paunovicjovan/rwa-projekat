import { inject } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import * as chatsActions from './chat.actions';
import { catchError, concatMap, exhaustMap, map, mergeMap, of, switchMap, tap } from "rxjs";
import { ChatService } from "../services/chat.service";
import { PaginatedResponse } from "../../../shared/models/paginated-response.interface";
import { Room } from "../models/room.interface";
import { AuthService } from "../../auth/services/auth.service";
import { MatDialog } from "@angular/material/dialog";
import { RoomFormDialogComponent } from "../components/room-form-dialog/room-form-dialog.component";
import { noOperation } from "../../../shared/state/shared.actions";
import { RoomDialogData } from "../models/room-dialog-data.interface";
import { CreateRoomDto } from "../models/create-room-dto.interface";

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

export const receiveRooms$ = createEffect(
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

export const openRoomDialog$ = createEffect(
    (action$ = inject(Actions), dialog = inject(MatDialog)) => {
        return action$.pipe(
            ofType(chatsActions.openRoomDialog),
            exhaustMap(({ dialogData }) => {
                const dialogRef = dialog.open(RoomFormDialogComponent, { width: '600px', data: dialogData });
                return dialogRef.afterClosed().pipe(
                    concatMap((dialogResult: RoomDialogData) => {
                        if (dialogResult === undefined) 
                            return of(noOperation());

                        if(dialogResult.id === undefined)
                        {
                            const createRoomDto : CreateRoomDto  = {
                                name: dialogResult.name!,
                                description: dialogResult.description!,
                                users: dialogResult.users!
                            }
                            return of(chatsActions.createRoom({ createRoomDto }))
                        }
                        else {
                            // const updateReviewDto: UpdateReviewDto = {
                            //     id: dialogResult.id,
                            //     content: dialogResult.content!,
                            //     rating: dialogResult.rating!
                            // }
                            // return of(reviewsActions.updateReview({updateReviewDto}));
                            return of(noOperation()); //privremeno
                        }
                      
                    })
                );
            }
            )
        )
    },
    {functional: true}
)

export const createRoom$ = createEffect(
    (action$ = inject(Actions), chatsService = inject(ChatService)) => {
        return action$.pipe(
            ofType(chatsActions.createRoom),
            tap(({createRoomDto}) =>
                chatsService.createRoom(createRoomDto)
            )
        )
    },
    {functional: true, dispatch: false}
)