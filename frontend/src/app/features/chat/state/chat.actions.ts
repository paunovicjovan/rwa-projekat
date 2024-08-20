import { createAction, props } from "@ngrx/store";
import { PaginatedResponse } from "../../../shared/models/paginated-response.interface";
import { Room } from "../models/room.interface";
import { PaginationParameters } from "../../../shared/models/pagination-parameters.interface";
import { RoomDialogData } from "../models/room-dialog-data.interface";
import { CreateRoomDto } from "../models/create-room-dto.interface";


export const connect = createAction(
    '[Chats] Connect'
);

export const disconnect = createAction(
    '[Chats] Disconnect'
)

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

export const openRoomDialog = createAction(
    '[Chats] Open Room Dialog',
    props<{ dialogData: RoomDialogData | undefined }>()
);

export const createRoom = createAction(
    '[Chats] Create Room',
    props<{ createRoomDto: CreateRoomDto }>()
);