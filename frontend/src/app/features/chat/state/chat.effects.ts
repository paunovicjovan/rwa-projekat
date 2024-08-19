import { inject } from "@angular/core"
import { Actions, createEffect, ofType } from "@ngrx/effects"
import * as chatsActions from './chat.actions';
import { catchError, map, mergeMap, of } from "rxjs";
import { ChatService } from "../services/chat.service";

export const receiveTestMessage$ = createEffect(
    (action$ = inject(Actions), chatsService = inject(ChatService)) => {
        return action$.pipe(
            ofType(chatsActions.connect),
            mergeMap(() =>
                chatsService.getMessage().pipe(
                    map((message: string) => {
                        return chatsActions.receiveTestMessage({ message })
                    }),
                    catchError(() => {
                        return of(chatsActions.receiveTestMessage({message: 'Greska'}))
                    }
                    )
                )
            )
        )
    },
    {functional: true}
)