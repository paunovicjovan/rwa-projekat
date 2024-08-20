import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Features } from "../../features.enum";
import { ChatState } from "../models/chat-state.interface";


export const chatsFeature = createFeatureSelector<ChatState>(Features.Chats);

export const selectRooms = createSelector(
    chatsFeature,
    (state: ChatState) => state.ids.map(id => state.entities[id])
)

export const selectPaginationMetadata = createSelector(
    chatsFeature,
    (state: ChatState) => state.paginationMetadata
)