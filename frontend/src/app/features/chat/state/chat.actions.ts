import { createAction, props } from "@ngrx/store";
import { PaginatedResponse } from "../../../shared/models/paginated-response.interface";
import { Room } from "../models/room/room.interface";
import { PaginationOptions } from "../../../shared/models/pagination-options.interface";
import { RoomDialogData } from "../models/room/room-dialog-data.interface";
import { CreateRoomDto } from "../models/room/create-room-dto.interface";
import { CreateMessageDto } from "../models/message/create-message-dto.interface";
import { Message } from "../models/message/message.interface";
import { User } from "../../users/models/user.interface";
import { UpdateRoomDto } from "../models/room/update-room-dto.interface";
import { MoreMessagesDto } from "../models/message/more-messages-dto.interface";


export const connect = createAction(
    '[Chats] Connect'
);

export const disconnect = createAction(
    '[Chats] Disconnect'
)

export const loadRooms = createAction(
    '[Chats] Load Rooms',
    props<{ paginationOptions: PaginationOptions }>()
);

export const openRoomDialog = createAction(
    '[Chats] Open Room Dialog',
    props<{ dialogData: RoomDialogData | undefined }>()
);

export const createRoom = createAction(
    '[Chats] Create Room',
    props<{ createRoomDto: CreateRoomDto }>()
);

export const updateRoom = createAction(
    '[Chats] Update Room',
    props<{ updateRoomDto: UpdateRoomDto }>()
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

export const loadMoreMessages = createAction(
    '[Chats] Load More Messages',
    props<{ request: MoreMessagesDto }>()
);

export const receiveMessagesSuccess = createAction(
    '[Chats] Receive Messages Success',
    props<{ paginatedMessages: PaginatedResponse<Message> }>()
)

export const receiveMessagesFailure = createAction(
    '[Chats] Receive Messages Failure'
)

export const receiveMoreMessagesSuccess = createAction(
    '[Chats] Receive More Messages Success',
    props<{ paginatedMessages: PaginatedResponse<Message> }>()
)

export const receiveMoreMessagesFailure = createAction(
    '[Chats] Receive More Messages Failure'
)

export const receiveNewMessageSuccess = createAction(
    '[Chats] Receive New Message Success',
    props<{ message: Message }>()
)

export const receiveNewMessageFailure = createAction(
    '[Chats] Receive New Message Failure'
)

export const receiveRoomMembersSuccess = createAction(
    '[Chats] Receive Room Members Success',
    props<{ members: User[] }>()
)

export const receiveRoomMembersFailure = createAction(
    '[Chats] Receive Room Members Failure'
)