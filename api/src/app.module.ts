import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PassportModule } from '@nestjs/passport';
import {TypeOrmModule} from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
              isGlobal:true
            }),
            AuthModule, 
            UsersModule,
            PassportModule.register({defaultStrategy:'jwt'}),
            TypeOrmModule.forRootAsync({
              imports: [ConfigModule],
              inject: [ConfigService],
              useFactory: (configService: ConfigService) => ({
                type:'postgres',
                host:'localhost',
                port:5432,
                username:configService.get('DB_USER'),
                password:configService.get('DB_PASSWORD'),
                database:configService.get('DB_NAME'),
                entities: [],
                autoLoadEntities:true,
                synchronize:true
              })
            })
          ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
