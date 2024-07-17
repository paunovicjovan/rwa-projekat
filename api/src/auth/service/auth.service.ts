import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable, of } from 'rxjs';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersService } from 'src/users/service/users.service';
const bcrypt = require('bcrypt');
const saltRounds = 10;

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    generateJWT(user: UserDto) : Observable<string> {
        return from(this.jwtService.signAsync({user}));
    }

    hashPassword(password: string) : Observable<string> {
        return bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
            if(err) {
                console.error(err);
                return of('');
            }
            else {
                return of(hashedPassword);
            }
        })
    }

    comparePasswords(password: string, passwordHash: string) : Observable<boolean> {
        return bcrypt.compare(password, passwordHash, (err, comparisonResult) => {
            if(err) {
                console.error(err);
                return of(false);
            }
            else {
                return of(comparisonResult);
            }
        })
    }

}
