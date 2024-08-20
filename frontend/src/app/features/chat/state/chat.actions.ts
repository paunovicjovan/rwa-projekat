import { createAction, props } from "@ngrx/store";
import { PaginatedResponse } from "../../../shared/models/paginated-response.interface";
import { Room } from "../models/room.interface";
import { PaginationParameters } from "../../../shared/models/pagination-parameters.interface";


export const connect = createAction(
    '[Chats] Connect'
);

export const loadRooms = createAction(
    '[Chats] Load Rooms',
    props<{ paginationOptions: PaginationParameters }>()
);

export const loadRoomsSuccess = createAction(
    '[Chats] Load Rooms Success',
    props<{ paginatedRooms: PaginatedResponse<Room> }>()
)

export const loadRoomsFailure = createAction(
    '[Chats] Load Rooms Failure'
)

export const disconnect = createAction(
    '[Chats] Disconnect'
)