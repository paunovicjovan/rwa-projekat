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
        private usersRepository: Repository<UserEntity>,
        @Inject(forwardRef(() => AuthService))
        private authService: AuthService
    ) {}

    create(user: CreateUserDto) : Observable<ReturnUserDto> {
        return from(this.usersRepository.findOne({where: {email: user.email}})).pipe(
            switchMap((existingUserByEmail: ReturnUserDto) => {
                if(existingUserByEmail)
                    return throwError(() => new Error('Već postoji korisnik sa zadatim e-mail-om.'))
                return from(this.usersRepository.findOne({where: {username: user.username}}))
            }),

            switchMap((existingUserByUsername: ReturnUserDto) => {
                if(existingUserByUsername)
                    return throwError(() => new Error('Već postoji korisnik sa zadatim korisničkim imenom.'))
                return this.authService.hashPassword(user.password)
            }),
            
            switchMap((passwordHash: string) => {
                user.password = passwordHash;
                const newUser = this.makeUserEntity(user);

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

    private makeUserEntity(user: CreateUserDto) : UserEntity {
        const userEntity = new UserEntity();
        userEntity.firstName = user.firstName;
        userEntity.lastName = user.lastName;
        userEntity.username = user.username;
        userEntity.email = user.email;
        userEntity.password = user.password;
        userEntity.role = UserRoles.USER;
        userEntity.dateCreated = new Date();
        
        return userEntity;
    }

    findAll(): Observable<ReturnUserDto[]> {
        return from(this.usersRepository.find());
    }

    findOneById(id: number): Observable<ReturnUserDto> {
        return from(this.usersRepository.findOne({where:{id}}));
    }

    findOneByEmail(email: string) : Observable<UserDto> {
        return from(this.usersRepository.findOne({where:{email}, select:['id', 'email', 'username', 'password', 'role']}));
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
