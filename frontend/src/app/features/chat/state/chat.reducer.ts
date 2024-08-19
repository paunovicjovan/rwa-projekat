import { createReducer, on } from "@ngrx/store";
import * as chatsActions from './chat.actions';
import { ChatState } from "../models/chat-state.interface";


const initialState: ChatState = {
    test: ''
}

export const chatsReducer = createReducer(
    initialState,
    on(chatsActions.connect, (state) => {
        return {
            ...state,
            test: 'Uspesno'
        }
    }),
    on(chatsActions.receiveTestMessage, (state, action) => {
        return {
            ...state,
            test: action.message
        }
    })
)