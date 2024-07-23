import { Body, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserDto } from '../dto/user.dto';
import { catchError, from, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { ReturnUserDto } from '../dto/return-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AuthService } from 'src/auth/service/auth.service';
import * as fs from 'fs';
import { UserRoles } from '../enums/user-roles.enum';

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
        return from(this.usersRepository.findOne({where:{id}}));
    }

    findOneByEmail(email: string) : Observable<ReturnUserDto> {
        return from(this.usersRepository.findOne({where:{email}}));
    }

    findOneByEmailWithPassword(email: string) : Observable<UserDto> {
        return from(this.usersRepository.findOne({where:{email}, select:['id', 'firstName', 'lastName', 'email', 'username', 'password', 'role', 'profileImage']}));
    }

    findOneByUsername(username: string) : Observable<ReturnUserDto> {
        return from(this.usersRepository.findOne({where:{username}}));
    }

    updateProfileImage(userId: number, imageName: string | null) : Observable<ReturnUserDto> {
        return this.deleteProfileImageFromFileSystem(userId).pipe(
            switchMap(() => this.updateOne(userId, {profileImage: imageName})),
        )
    }

    updateOne(id: number, userData: UpdateUserDto) : Observable<ReturnUserDto> {
        return from(this.usersRepository.update(id, userData)).pipe(
            switchMap(() => this.findOneById(id))
        );
    }

    deleteOne(id: number) : Observable<any> {
        return this.deleteProfileImageFromFileSystem(id).pipe(
            switchMap(()=> {
                return this.usersRepository.delete(id);
            })
        )
    }

    private deleteProfileImageFromFileSystem(userId: number): Observable<ReturnUserDto> {
        return this.findOneById(userId).pipe(
            tap((user: ReturnUserDto) => {
                if(user.profileImage !== null) {
                    const userProfileImagePath = `./uploads/profile-images/${user.profileImage}`;
                    fs.unlinkSync(userProfileImagePath);
                }
            })
        );
    }
}
