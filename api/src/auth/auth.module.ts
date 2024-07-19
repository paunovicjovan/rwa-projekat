import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guards/jwt.strategy';
import { AuthController } from './controller/auth.controller';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    forwardRef(()=>UsersModule),
    PassportModule.register({defaultStrategy:'jwt'}),
    JwtModule.register({
      secret: 'sadasdjio3jdoasd',
      signOptions: {expiresIn:'3600s'}
    })
  ],
  providers: [AuthService, JwtStrategy, RolesGuard, JwtAuthGuard],
  exports: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
