import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat/chat.gateway';
import { ConnectedUserService } from './service/connected-user/connected-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectedUserEntity } from './entities/connected-user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { RoomEntity } from './entities/room.entity';
import { RoomsService } from './service/rooms/rooms.service';

@Module({
  providers: [ChatGateway, ConnectedUserService, RoomsService],
  imports: [
    TypeOrmModule.forFeature([ConnectedUserEntity, RoomEntity]),
    AuthModule,
    UsersModule
  ]
})
export class ChatModule {}
