import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import {Socket, Server} from 'socket.io'
import { AuthService } from 'src/auth/service/auth.service';
import { ConnectedUserDto } from 'src/chat/dto/connected-user/connected-user.dto';
import { CreateConnectedUserDto } from 'src/chat/dto/connected-user/create-connected-user.dto';
import { CreateJoinedRoomDto } from 'src/chat/dto/joined-room/create-joined-room.dto';
import { JoinedRoomResponseDto } from 'src/chat/dto/joined-room/joined-room-response.dto';
import { JoinedRoomDto } from 'src/chat/dto/joined-room/joined-room.dto';
import { CreateMessageDto } from 'src/chat/dto/message/create-message.dto';
import { MessageResponseDto } from 'src/chat/dto/message/message-response.dto';
import { CreateRoomDto } from 'src/chat/dto/room/create-room.dto';
import { RoomResponseDto } from 'src/chat/dto/room/room-response.dto';
import { RoomDto } from 'src/chat/dto/room/room.dto';
import { ConnectedUserService } from 'src/chat/service/connected-user/connected-user.service';
import { JoinedRoomsService } from 'src/chat/service/joined-rooms/joined-rooms.service';
import { MessagesService } from 'src/chat/service/messages/messages.service';
import { RoomsService } from 'src/chat/service/rooms/rooms.service';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/service/users.service';

@WebSocketGateway({ cors: {origin: ['http://localhost:4200']}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {

  @WebSocketServer()
  server: Server

  constructor(private authService: AuthService,
              private connectedUserService: ConnectedUserService,
              private usersService: UsersService,
              private roomsService: RoomsService,
              private messagesService: MessagesService,
              private joinedRoomsService: JoinedRoomsService
            ) {}

  async onModuleInit() {
    await this.connectedUserService.deleteAll();
    await this.joinedRoomsService.deleteAll();
  }

  async handleConnection(socket: Socket) {
    try {
      const decodedToken = await this.authService.decodeJWT(socket.handshake.headers.authorization);
      const user: UserDto = await this.usersService.findOneById(decodedToken.sub);
      
      if(!user) {
        return this.disconnect(socket);
      }

      socket.data.user = user;
      await this.createConnectedUser(socket);

      const userRooms = await this.roomsService.findRoomsForUser(user.id, {page: 1, limit: 10});
      return this.server.to(socket.id).emit('rooms', userRooms);
    }
    catch {
      return this.disconnect(socket);
    }
  }

  async createConnectedUser(socket: Socket) {
    const connectedUserDto: CreateConnectedUserDto = {
      socketId: socket.id,
      user: socket.data.user
    }
    await this.connectedUserService.create(connectedUserDto);
  }
  
  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  async handleDisconnect(socket: Socket) {
    await this.connectedUserService.deleteBySocketId(socket.id);
    socket.disconnect();
  }

  @SubscribeMessage('createRoom')
  async onCreateRoom(socket: Socket, room: CreateRoomDto) {
    const createdRoom = await this.roomsService.createRoom(room, socket.data.user);

    for (const user of createdRoom.users) {
      const rooms = await this.roomsService.findRoomsForUser(user.id, { page: 1, limit: 10 });
      const connections: ConnectedUserDto[] = await this.connectedUserService.findByUserId(user.id);
      for (const connection of connections) {
        await this.server.to(connection.socketId).emit('rooms', rooms);
      }
    }
  }
  
  @SubscribeMessage('loadRooms')
  async onPaginateRooms(socket: Socket, paginationOptions: IPaginationOptions) {
    paginationOptions.limit = Math.min(100, Number(paginationOptions.limit));
    const rooms = await this.roomsService.findRoomsForUser(socket.data.user.id, paginationOptions);
    return this.server.to(socket.id).emit('rooms', rooms);
  }

  @SubscribeMessage('joinRoom')
  async onJoinRoom(socket: Socket, room: RoomDto) {
    const messages = await this.messagesService.findMessagesForRoom(room.id, { page:1, limit: 20 });
    const createJoinedRoomDto: CreateJoinedRoomDto = {
      socketId: socket.id,
      room: room,
      user: socket.data.user
    }
    await this.joinedRoomsService.create(createJoinedRoomDto);
    return this.server.to(socket.id).emit('messages', messages);
  }

  @SubscribeMessage('leaveRoom')
  async onLeaveRoom(socket: Socket) {
    await this.joinedRoomsService.deleteBySocketId(socket.id);
  }

  @SubscribeMessage('addMessage')
  async onAddMessage(socket: Socket, message: CreateMessageDto) {
    const createdMessage: MessageResponseDto = await this.messagesService.create({...message, user: socket.data.user});
    // const room: RoomResponseDto = await this.roomsService.findRoom(createdMessage.room.id);
    const joinedUsers: JoinedRoomResponseDto[] = await this.joinedRoomsService.findByRoomId(message.room.id);

    for(const user of joinedUsers) {
      await this.server.to(user.socketId).emit('newMessage', createdMessage);
    }
  }
}
