import { Module } from '@nestjs/common';
import { ChatGateway } from './gateway/chat/chat.gateway';
import { ConnectedUserService } from './service/connected-user/connected-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectedUserEntity } from './entities/connected-user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [ChatGateway, ConnectedUserService],
  imports: [
    TypeOrmModule.forFeature([ConnectedUserEntity]),
    AuthModule,
    UsersModule
  ]
})
export class ChatModule {}
