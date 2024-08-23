import { Inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CustomSocket } from '../sockets/custom-socket';
import { PaginatedResponse } from '../../../shared/models/paginated-response.interface';
import { Room } from '../models/room/room.interface';
import { PaginationOptions } from '../../../shared/models/pagination-options.interface';
import { CreateRoomDto } from '../models/room/create-room-dto.interface';
import { Message } from '../models/message/message.interface';
import { CreateMessageDto } from '../models/message/create-message-dto.interface';
import { User } from '../../users/models/user.interface';
import { UpdateRoomDto } from '../models/room/update-room-dto.interface';
import { MoreMessagesDto } from '../models/message/more-messages-dto.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: CustomSocket) { }

  connect(jwt: string | null) {
    this.socket.ioSocket.io.opts.extraHeaders = { Authorization: jwt };
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  loadRooms(paginationOptions: PaginationOptions) {
    this.socket.emit('loadRooms', {page: paginationOptions.page, limit: paginationOptions.limit});
  }

  createRoom(room: CreateRoomDto) {
    this.socket.emit('createRoom', room);
  }

  updateRoom(room: UpdateRoomDto) {
    this.socket.emit('updateRoom', room);
  }

  joinRoom(room: Room) {
    this.socket.emit('joinRoom', room);
  }

  leaveRoom() {
    this.socket.emit('leaveRoom');
  }

  sendMessage(message: CreateMessageDto) {
    this.socket.emit('addMessage', message);
  }

  loadMoreMessages(request: MoreMessagesDto) {
    this.socket.emit('loadMoreMessages', request);
  }

  receiveMessages(): Observable<PaginatedResponse<Message>> {
    return this.socket.fromEvent<PaginatedResponse<Message>>('messages');
  }

  receiveMoreMessages(): Observable<PaginatedResponse<Message>> {
    return this.socket.fromEvent<PaginatedResponse<Message>>('moreMessages');
  }

  receiveRooms(): Observable<PaginatedResponse<Room>> {
    return this.socket.fromEvent<PaginatedResponse<Room>>('rooms');
  }

  receiveNewMessage(): Observable<Message> {
    return this.socket.fromEvent<Message>('newMessage');
  }

  receiveRoomMembers(): Observable<User[]> {
    return this.socket.fromEvent<User[]>('members');
  }

}
