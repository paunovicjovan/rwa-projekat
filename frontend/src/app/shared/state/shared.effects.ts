import { inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as sharedActions from './shared.actions';
import { exhaustMap, map } from "rxjs";
import { ConfirmDialogComponent } from "../components/confirm-dialog/confirm-dialog.component";

export const openConfirmationDialog$ = createEffect(
    (action$ = inject(Actions), dialog = inject(MatDialog)) => {
        return action$.pipe(
            ofType(sharedActions.openConfirmationDialog),
            exhaustMap(({ message, actionToDispatch }) => {
                const dialogRef = dialog.open(ConfirmDialogComponent, {
                    width: '400px',
                    position: { top: '50px' },
                    data: { message }
                });

                return dialogRef.afterClosed().pipe(
                    map((dialogResult: boolean) => {
                        if(dialogResult)
                            return actionToDispatch;
                        else
                            return sharedActions.noOperation()
                    })
                );
            }
            )
        )
    },
    {functional: true}
)