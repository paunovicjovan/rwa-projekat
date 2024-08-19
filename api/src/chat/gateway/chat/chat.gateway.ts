import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import {Socket, Server} from 'socket.io'
import { AuthService } from 'src/auth/service/auth.service';
import { CreateConnectedUserDto } from 'src/chat/dto/connected-user/create-connected-user.dto';
import { ConnectedUserService } from 'src/chat/service/connected-user/connected-user.service';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/service/users.service';

@WebSocketGateway({ cors: {origin: ['http://localhost:4200']}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {

  @WebSocketServer()
  server: Server

  constructor(private authService: AuthService,
              private connectedUserService: ConnectedUserService,
              private usersService: UsersService
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

      const connectedUserDto: CreateConnectedUserDto = {
        socketId: socket.id,
        user: user
      }
      await this.connectedUserService.create(connectedUserDto);

      return this.server.to(socket.id).emit('messageResponse', 'Connected');
    }
    catch {
      return this.disconnect(socket);
    }
  }
  
  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }

  async handleDisconnect(socket: Socket) {
    await this.connectedUserService.deleteBySocketId(socket.id);
    socket.disconnect();
  }
  
}
