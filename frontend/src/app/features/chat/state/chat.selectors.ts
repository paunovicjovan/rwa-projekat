import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Features } from "../../features.enum";
import { ChatState } from "../models/chat-state.interface";
import { Dictionary } from "@ngrx/entity";
import { Room } from "../models/room.interface";


export const chatsFeature = createFeatureSelector<ChatState>(Features.Chats);

export const selectRooms = createSelector(
    chatsFeature,
    (state: ChatState) => state.ids.map(id => state.entities[id])
                                   .filter(room => room != undefined)
                                   .map(room => room as Room)
)

export const selectRoomsPaginationMetadata = createSelector(
    chatsFeature,
    (state: ChatState) => state.roomsPaginationMetadata
)

export const selectAllRoomsAsDict = createSelector(
    chatsFeature,
    (state: ChatState) => state.entities,
);

export const selectChosenRoomId = createSelector(
    chatsFeature,
    (state: ChatState) => state.chosenRoomId
)

export const selectChosenRoom = createSelector(
    selectAllRoomsAsDict,
    selectChosenRoomId,
    (rooms: Dictionary<Room>, chatroomId: number | null) => chatroomId ? rooms[chatroomId] : null
)

export const selectMessages = createSelector(
    chatsFeature,
    (state: ChatState) => state.messages
)

export const selectMessagesPaginationMetadata = createSelector(
    chatsFeature,
    (state: ChatState) => state.messagesPaginationMetadata
)

export const selectIsLoading = createSelector(
    chatsFeature,
    (state: ChatState) => state.isLoading
)