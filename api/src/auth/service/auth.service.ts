import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { catchError, from, map, Observable, of, switchMap, throwError } from 'rxjs';
import { ReturnUserDto } from 'src/users/dto/return-user.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/service/users.service';
import { LoginRequestDto } from '../dto/login-request.dto';
import { AuthenticatedUserDto } from 'src/users/dto/authenticated-user.dto';
const bcrypt = require('bcrypt');
const saltRounds = 10;

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService,
        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService
    ) {}

    login(credentials: LoginRequestDto) : Observable<AuthenticatedUserDto> {
        return this.validateUser(credentials.email, credentials.password).pipe(
            switchMap((user: UserDto) => {
                if(user)
                    return this.generateJWT(user).pipe(
                        map((token: string) => {
                            return {user, token}
                        })
                    )
            })
        )
    } 

    private validateUser(email: string, password: string): Observable<UserDto> {
        return this.usersService.findOneByEmail(email).pipe(
            switchMap((user: UserDto) => {
                return this.comparePasswords(password, user.password).pipe(
                    map((isCorrectPassword: boolean) => {
                        if(isCorrectPassword)
                        {
                            delete user.password;
                            return user;
                        }
                        else {
                            throw new UnauthorizedException();
                        }
                    })
                )
            })
        )
    }

    comparePasswords(password: string, passwordHash: string) : Observable<any | boolean> {
        return from<any | boolean>(bcrypt.compare(password, passwordHash));
    }

    generateJWT(user: UserDto) : Observable<string> {
        const payload = { email: user.email, sub: user.id };
        return from(this.jwtService.signAsync(payload));
    }

    hashPassword(password: string) : Observable<string> {
        return from<string>(bcrypt.hash(password, saltRounds));
    }
}
