import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { UsersService } from 'src/users/service/users.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guards/jwt.strategy';

@Module({
  imports: [
    forwardRef(()=>UsersModule),
    PassportModule.register({defaultStrategy:'jwt'}),
    JwtModule.register({
      secret: 'sadasdjio3jdoasd',
      signOptions: {expiresIn:'3600s'}
    })
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
