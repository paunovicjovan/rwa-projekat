import { createReducer, on } from "@ngrx/store";
import * as chatsActions from './chat.actions';
import { ChatState } from "../models/chat-state.interface";
import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { Room } from "../models/room.interface";
import { PaginationMetadata } from "../../../shared/models/pagination-metadata.interface";

const initialPaginationMetadataState : PaginationMetadata = {
    totalItems: 0,
    itemCount: 10,
    itemsPerPage: 10,
    totalPages: 1,
    currentPage: 1    
}

const initialState: ChatState = {
    ids: [],
    entities: {},
    paginationMetadata: initialPaginationMetadataState,
    chosenRoomId: null,
    messages: []
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
        return chatsAdapter.setAll(action.paginatedRooms.items, {
            ...state,
            paginationMetadata: action.paginatedRooms.meta
        });
    }),
    on(chatsActions.chooseRoom, (state, action) => {
        return {
            ...state,
            chosenRoomId: action.roomId
        }
    })
)