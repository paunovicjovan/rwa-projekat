import { createReducer, on } from "@ngrx/store";
import * as chatsActions from './chat.actions';
import { ChatState } from "../models/chat-state.interface";
import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { Room } from "../models/room.interface";


const initialState: ChatState = {
    ids: [],
    entities: {}
}

export const chatsAdapter: EntityAdapter<Room> = createEntityAdapter<Room>();

export const chatsReducer = createReducer(
    initialState,
    on(chatsActions.connect, (state) => { //obrisi ako nema nista da se doda
        return {
            ...state,
        }
    }),
    on(chatsActions.loadRoomsSuccess, (state, action) => {
        return chatsAdapter.setAll(action.paginatedRooms.items, state);
    })
)