import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import {Socket, Server} from 'socket.io'
import { AuthService } from 'src/auth/service/auth.service';
import { ConnectedUserDto } from 'src/chat/dto/connected-user/connected-user.dto';
import { CreateConnectedUserDto } from 'src/chat/dto/connected-user/create-connected-user.dto';
import { CreateRoomDto } from 'src/chat/dto/room/create-room.dto';
import { RoomResponseDto } from 'src/chat/dto/room/room-response.dto';
import { ConnectedUserService } from 'src/chat/service/connected-user/connected-user.service';
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
              private roomsService: RoomsService
            ) {}

  async onModuleInit() {
    await this.connectedUserService.deleteAll();
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
  async onPaginateRoom(socket: Socket, paginationOptions: IPaginationOptions) {
    paginationOptions.limit = Math.min(100, Number(paginationOptions.limit));
    const rooms = await this.roomsService.findRoomsForUser(socket.data.user.id, paginationOptions);
    return this.server.to(socket.id).emit('rooms', rooms);
  }
}
