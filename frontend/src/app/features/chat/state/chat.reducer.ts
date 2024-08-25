import { createReducer, on } from "@ngrx/store";
import * as chatsActions from './chat.actions';
import { ChatState } from "../models/chat-state.interface";
import { createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { Room } from "../models/room/room.interface";
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
    roomsPaginationMetadata: initialPaginationMetadataState,
    chosenRoomId: null,
    messages: [],
    messagesPaginationMetadata: initialPaginationMetadataState,
    isLoading: false
}

export const chatsAdapter: EntityAdapter<Room> = createEntityAdapter<Room>();

export const chatsReducer = createReducer(
    initialState,
    on(chatsActions.receiveRoomsSuccess, (state, action) => {
        return chatsAdapter.setAll(action.paginatedRooms.items, {
            ...state,
            roomsPaginationMetadata: action.paginatedRooms.meta
        });
    }),
    on(chatsActions.receiveMessagesSuccess, (state, action) => {
        return {
            ...state,
            messages: action.paginatedMessages.items,
            messagesPaginationMetadata: action.paginatedMessages.meta,
            isLoading: false
        };
    }),
    on(chatsActions.receiveMessagesFailure, (state, action) => {
        return {
            ...state,
            isLoading: false
        };
    }),
    on(chatsActions.receiveMoreMessagesSuccess, (state, action) => {
        return {
            ...state,
            messages: [...action.paginatedMessages.items, ...state.messages],
            messagesPaginationMetadata: action.paginatedMessages.meta
        };
    }),
    on(chatsActions.chooseRoom, (state, action) => {
        return {
            ...state,
            chosenRoomId: action.roomId,
            isLoading: true
        }
    }),
    on(chatsActions.receiveNewMessageSuccess, (state, action) => {
        return {
            ...state,
            messages: [...state.messages, action.message],
            messagesPaginationMetadata: {
                ...state.messagesPaginationMetadata,
                totalItems: state.messagesPaginationMetadata.totalItems + 1,
                itemCount: state.messagesPaginationMetadata.itemCount + 1
            }
        }
    })
)