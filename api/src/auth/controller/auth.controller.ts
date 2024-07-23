import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { LoginRequestDto } from '../dto/login-request.dto';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { AuthResponseDto } from 'src/auth/dto/auth-response.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ReturnUserDto } from 'src/users/dto/return-user.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('register')
    register(@Body() user: CreateUserDto) : Observable<AuthResponseDto> {
        return this.authService.register(user).pipe(
            map((user: AuthResponseDto) => user),
            catchError((err) => throwError(()=>new HttpException(err.message, HttpStatus.BAD_REQUEST)))
        );
    }

    @Post('login')
    login(@Body() credentials: LoginRequestDto) : Observable<AuthResponseDto> {
        return this.authService.login(credentials).pipe(
            catchError((err) => throwError(() => new HttpException('Neispravan e-mail ili lozinka.', HttpStatus.BAD_REQUEST)))
        )
    }
}
