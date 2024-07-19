import { Body, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserDto } from '../dto/user.dto';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { ReturnUserDto } from '../dto/return-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AuthService } from 'src/auth/service/auth.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
        @Inject(forwardRef(() => AuthService))
        private authService: AuthService
    ) {}

    create(user: CreateUserDto) : Observable<ReturnUserDto> {
        return this.authService.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
                const newUser = new UserEntity();
                newUser.username = user.username;
                newUser.email = user.email;
                newUser.password = passwordHash;

                return from(this.usersRepository.save(newUser)).pipe(
                    map((savedUser: UserDto) => {
                        const {password, ...result} = savedUser;
                        return result;
                    }),
                    catchError(err => throwError(() => new Error(err)))
                )
            })
        )
    }

    findAll(): Observable<ReturnUserDto[]> {
        return from(this.usersRepository.find());
    }

    findOneById(id: number): Observable<ReturnUserDto> {
        return from(this.usersRepository.findOne({where:{id}}));
    }

    findOneByEmail(email: string) : Observable<UserDto> {
        return from(this.usersRepository.findOne({where:{email}, select:['id', 'email', 'username', 'password']}));
    }

    updateOne(id: number, userData: UpdateUserDto) : Observable<ReturnUserDto> {
        return from(this.usersRepository.update(id, userData)).pipe(
            switchMap(() => this.findOneById(id))
        );
    }

    deleteOne(id: number) : Observable<any> {
        return from(this.usersRepository.delete(id));
    }
}
