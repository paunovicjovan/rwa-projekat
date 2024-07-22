import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { LoginRequestDto } from '../dto/login-request.dto';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { AuthenticatedUserDto } from 'src/users/dto/authenticated-user.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('login')
    login(@Body() credentials: LoginRequestDto) : Observable<AuthenticatedUserDto> {
        return this.authService.login(credentials).pipe(
            catchError((err) => throwError(() => new HttpException('Neispravan e-mail ili lozinka.', HttpStatus.BAD_REQUEST)))
        )
    }
}
