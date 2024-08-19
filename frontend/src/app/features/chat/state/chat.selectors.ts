import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Features } from "../../features.enum";
import { ChatState } from "../models/chat-state.interface";


export const chatsFeature = createFeatureSelector<ChatState>(Features.Chats);

export const selectTest = createSelector(
    chatsFeature,
    (state: ChatState) => state.test
)