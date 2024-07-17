import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserDto } from '../dto/user.dto';
import { from, Observable, switchMap } from 'rxjs';
import { ReturnUserDto } from '../dto/return-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>
    ) {}

    create(user: CreateUserDto) : Observable<ReturnUserDto> {
        return from(this.usersRepository.save(user));
    }

    findAll(): Observable<ReturnUserDto[]> {
        return from(this.usersRepository.find());
    }

    findOneById(id: number): Observable<ReturnUserDto> {
        return from(this.usersRepository.findOne({where:{id}}))
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
