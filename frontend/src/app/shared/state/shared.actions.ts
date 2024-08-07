import { Action, createAction, props } from "@ngrx/store";

export const noOperation = createAction(
    "[Shared] No Operation"
);

export const openConfirmationDialog = createAction(
    "[Shared] Open Confirmation Dialog",
    props<{message: string, actionToDispatch: Action}>()
)