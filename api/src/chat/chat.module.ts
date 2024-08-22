import { forwardRef, Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat/chat.gateway';
import { ConnectedUserService } from './service/connected-user/connected-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectedUserEntity } from './entities/connected-user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { RoomEntity } from './entities/room.entity';
import { RoomsService } from './service/rooms/rooms.service';
import { JoinedRoomsService } from './service/joined-rooms/joined-rooms.service';
import { JoinedRoomEntity } from './entities/joined-room.entity';
import { MessagesService } from './service/messages/messages.service';
import { MessageEntity } from './entities/message.entity';

@Module({
  providers: [ChatGateway, ConnectedUserService, RoomsService, JoinedRoomsService, MessagesService],
  imports: [
    TypeOrmModule.forFeature([ConnectedUserEntity, RoomEntity, JoinedRoomEntity, MessageEntity]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule)
  ],
  exports: [JoinedRoomsService, ConnectedUserService, MessagesService]
})
export class ChatModule {}
