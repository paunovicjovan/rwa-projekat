import { createAction, props } from "@ngrx/store";
import { PaginatedResponse } from "../../../shared/models/paginated-response.interface";
import { Room } from "../models/room.interface";
import { PaginationParameters } from "../../../shared/models/pagination-parameters.interface";
import { RoomDialogData } from "../models/room-dialog-data.interface";
import { CreateRoomDto } from "../models/create-room-dto.interface";
import { CreateMessageDto } from "../models/create-message-dto.interface";
import { Message } from "../models/message.interface";


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

export const openRoomDialog = createAction(
    '[Chats] Open Room Dialog',
    props<{ dialogData: RoomDialogData | undefined }>()
);

export const createRoom = createAction(
    '[Chats] Create Room',
    props<{ createRoomDto: CreateRoomDto }>()
);

export const receiveRoomsSuccess = createAction(
    '[Chats] Receive Rooms Success',
    props<{ paginatedRooms: PaginatedResponse<Room> }>()
)

export const receiveRoomsFailure = createAction(
    '[Chats] Receive Rooms Failure'
)

export const chooseRoom = createAction(
    '[Chats] Choose Room',
    props<{roomId: number}>()
)

export const joinRoom = createAction(
    '[Chats] Join Room',
    props<{room: Room}>()
)

export const leaveRoom = createAction(
    '[Chats] Leave Room'
)

export const sendMessage = createAction(
    '[Chats] Send Message',
    props<{ createMessageDto: CreateMessageDto }>()
)

export const receiveMessagesSuccess = createAction(
    '[Chats] Receive Messages Success',
    props<{ paginatedMessages: PaginatedResponse<Message> }>()
)

export const receiveMessagesFailure = createAction(
    '[Chats] Receive Messages Failure'
)

export const receiveNewMessageSuccess = createAction(
    '[Chats] Receive New Message Success',
    props<{ message: Message }>()
)

export const receiveNewMessageFailure = createAction(
    '[Chats] Receive New Message Failure'
)