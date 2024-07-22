import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { LoginRequestDto } from '../dto/login-request.dto';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post('login')
    login(@Body() credentials: LoginRequestDto) : Observable<Object> {
        return this.authService.login(credentials).pipe(
            map((token: string) => ({access_token: token})),
            catchError((err) => throwError(() => new HttpException('Neispravan e-mail ili lozinka.', HttpStatus.BAD_REQUEST)))
        )
    }
}
