import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [AuthModule, 
            UsersModule,
            PassportModule.register({defaultStrategy:'jwt'})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
