import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable, of } from 'rxjs';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/service/users.service';
const bcrypt = require('bcrypt');
const saltRounds = 10;

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService
    ) {}

    generateJWT(user: UserDto) : Observable<string> {
        const payload = { username: user.username, sub: user.id };
        return from(this.jwtService.signAsync(payload));
    }

    hashPassword(password: string) : Observable<string> {
        return from<string>(bcrypt.hash(password, saltRounds));
    }

    comparePasswords(password: string, passwordHash: string) : Observable<boolean> {
        return of<boolean>(bcrypt.compare(password, passwordHash));
    }

    
}
