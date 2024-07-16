import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PassportModule } from '@nestjs/passport';
import {TypeOrmModule} from '@nestjs/typeorm'

@Module({
  imports: [AuthModule, 
            UsersModule,
            PassportModule.register({defaultStrategy:'jwt'}),
            TypeOrmModule.forRoot({
              type:'postgres',
              host:'localhost',
              port:5432,
              username:'postgres',
              password:'mysecretpassword',
              database:'rwa_db',
              entities: [],
              autoLoadEntities:true,
              synchronize:true
            })
          ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
