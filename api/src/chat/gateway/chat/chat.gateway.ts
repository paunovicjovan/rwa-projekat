import { OnModuleInit } from '@nestjs/common';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import {Socket, Server} from 'socket.io'

@WebSocketGateway({ cors: {origin: ['http://localhost:4200']}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server

  handleConnection(socket: Socket) {
    
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    console.log(client);
    console.log(payload);
    this.server.emit('messageResponse', 'Odgovor');
    return 'Hello world!';
  }

  handleDisconnect(socket: Socket) {
    
  }
  
}
