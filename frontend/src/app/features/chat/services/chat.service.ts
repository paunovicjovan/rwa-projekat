import { Inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CustomSocket } from '../sockets/custom-socket';
import { PaginatedResponse } from '../../../shared/models/paginated-response.interface';
import { Room } from '../models/room.interface';
import { PaginationParameters } from '../../../shared/models/pagination-parameters.interface';
import { CreateRoomDto } from '../models/create-room-dto.interface';
import { Message } from '../models/message.interface';
import { CreateMessageDto } from '../models/create-message-dto.interface';
import { User } from '../../users/models/user.interface';
import { UpdateRoomDto } from '../models/update-room-dto.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  // constructor(@Inject(CustomSocket) private socket: CustomSocket) { }
  constructor(private socket: CustomSocket) { }

  connect(jwt: string | null) {
    this.socket.ioSocket.io.opts.extraHeaders = { Authorization: jwt };
    this.socket.connect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  loadRooms(paginationOptions: PaginationParameters) {
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

  receiveMessages(): Observable<PaginatedResponse<Message>> {
    return this.socket.fromEvent<PaginatedResponse<Message>>('messages');
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
