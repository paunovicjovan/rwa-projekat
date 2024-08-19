import { createAction, props } from "@ngrx/store";


export const connect = createAction(
    '[Chats] Connect'
);

export const receiveTestMessage = createAction(
    '[Chats] Receive Test Message',
    props<{message: string}>()
)

export const disconnect = createAction(
    '[Chats] Disconnect'
)