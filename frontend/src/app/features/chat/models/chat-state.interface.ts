import { EntityState } from "@ngrx/entity";
import { Room } from "./room/room.interface";
import { PaginationMetadata } from "../../../shared/models/pagination-metadata.interface";
import { Message } from "primeng/api";

export interface ChatState extends EntityState<Room> {
    roomsPaginationMetadata: PaginationMetadata;
    chosenRoomId: number | null;
    messages: Message[];
    messagesPaginationMetadata: PaginationMetadata;
    isLoading: boolean;
}