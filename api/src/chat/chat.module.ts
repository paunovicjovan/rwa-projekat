import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat/chat.gateway';
import { ConnectedUserService } from './service/connected-user/connected-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectedUserEntity } from './entities/connected-user.entity';

@Module({
  providers: [ChatGateway, ConnectedUserService],
  imports: [
    TypeOrmModule.forFeature([ConnectedUserEntity])
  ]
})
export class ChatModule {}
