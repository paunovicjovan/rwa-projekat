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

    async register(userDto: CreateUserDto) : Promise<AuthResponseDto> {
        const existingUserByEmail = await this.usersService.findOneByEmail(userDto.email);
        if(existingUserByEmail)
            throw new Error('Već postoji korisnik sa zadatim e-mail-om.');

        const existingUserByUsername = await this.usersService.findOneByUsername(userDto.username);
        if(existingUserByUsername)
            throw new Error('Već postoji korisnik sa zadatim korisničkim imenom.');

        const passwordHash = await this.hashPassword(userDto.password);
        userDto.password = passwordHash;
        const userEntity = this.makeUserEntity(userDto);
        const createdUser = await this.usersService.create(userEntity);

        if(createdUser) {
            const token = await this.generateJWT(createdUser);
            const {password, ...userWithoutPassword} = createdUser;
            return {user: userWithoutPassword, token: token}
        }
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
        
    async login(credentials: LoginRequestDto) : Promise<AuthResponseDto> {
        const user = await this.validateUser(credentials.email, credentials.password);
        if(user) {
            const token = await this.generateJWT(user);
            return {user, token}
        }
    } 

    private async validateUser(email: string, password: string): Promise<UserDto> {
        const user = await this.usersService.findOneByEmailWithPassword(email);
        const isCorrectPassword = await this.comparePasswords(password, user.password);
        if(isCorrectPassword) {
            const {password, ...userWithoutPassword} = user;
            return userWithoutPassword as UserDto;
        }
        else {
            throw new Error('Neispravan e-mail ili lozinka.')
        }
    }

    async comparePasswords(password: string, passwordHash: string) : Promise<any | boolean> {
        return bcrypt.compare(password, passwordHash);
    }

    async generateJWT(user: UserDto) : Promise<string> {
        const payload = { email: user.email, sub: user.id };
        return await this.jwtService.signAsync(payload);
    }

    async hashPassword(password: string) : Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }
}
