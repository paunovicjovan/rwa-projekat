import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { LoginRequestDto } from '../dto/login-request.dto';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { AuthResponseDto } from 'src/auth/dto/auth-response.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body() user: CreateUserDto) : Promise<AuthResponseDto> {
        try {
            return await this.authService.register(user);
        }
        catch(err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
        }
    }

    @Post('login')
    async login(@Body() credentials: LoginRequestDto) : Promise<AuthResponseDto> {
        try {
            return await this.authService.login(credentials);
        }
        catch(err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST)
        }
    }
}
