import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { catchError, from, map, Observable, of, switchMap, throwError } from 'rxjs';
import { UserResponseDto } from 'src/users/dto/user-response.dto';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/service/users.service';
import { LoginRequestDto } from '../dto/login-request.dto';
import { AuthResponseDto } from 'src/auth/dto/auth-response.dto';
import { UserRoles } from 'src/users/enums/user-roles.enum';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService,
        private usersService: UsersService
    ) {}

    register(user: CreateUserDto) : Observable<AuthResponseDto> {
        return this.usersService.findOneByEmail(user.email).pipe(
            switchMap((existingUserByEmail: UserResponseDto) => {
                if(existingUserByEmail)
                    return throwError(() => new Error('Već postoji korisnik sa zadatim e-mail-om.'));
                return this.usersService.findOneByUsername(user.username);
            }),

            switchMap((existingUserByUsername: UserResponseDto) => {
                if(existingUserByUsername)
                    return throwError(() => new Error('Već postoji korisnik sa zadatim korisničkim imenom.'));
                return this.hashPassword(user.password);
            }),
            
            switchMap((passwordHash: string) => {
                user.password = passwordHash;
                const newUser = this.makeUserEntity(user);
                return this.usersService.create(newUser);
            }),

            switchMap((user: UserDto) => {
                return this.generateJWT(user).pipe(
                    map((token: string) => {
                        const {password, ...userWithoutPassword} = user;
                        return {user: userWithoutPassword, token: token}
                    })
                )
            })
        )
    }

    private makeUserEntity(user: CreateUserDto) : UserEntity {
        const userEntity : UserEntity = {
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            email: user.email,
            password: user.password,
            role: UserRoles.USER,
            createdAt: new Date()
        } as UserEntity;
        
        return userEntity;
    }
        
    login(credentials: LoginRequestDto) : Observable<AuthResponseDto> {
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
        return this.usersService.findOneByEmailWithPassword(email).pipe(
            switchMap((user: UserDto) => {
                return this.comparePasswords(password, user.password).pipe(
                    map((isCorrectPassword: boolean) => {
                        if(isCorrectPassword)
                        {
                            const {password, ...userWithoutPassword} = user;
                            return userWithoutPassword as UserDto;
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
        const saltRounds = 10;
        return from<string>(bcrypt.hash(password, saltRounds));
    }
}
