import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Like, Raw, Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserDto } from '../dto/user.dto';
import { from, map, Observable, of, pluck, switchMap, tap } from 'rxjs';
import { UserResponseDto } from '../dto/user-response.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as fs from 'fs';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { SearchUsersFilters } from '../dto/search-users-filters.dto';
import { TagDto } from 'src/tags/dto/tag.dto';
import { TagsService } from 'src/tags/service/tags.service';
import { TagResponseDto } from 'src/tags/dto/tag-response.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>
    ) {}

    create(user: CreateUserDto) : Observable<UserResponseDto> {
        user.email = user.email.toLowerCase();
        user.username = user.username.toLowerCase();
        return from(this.usersRepository.save(user));
    }

    findManyPaginated(options: IPaginationOptions, filters: SearchUsersFilters) : Observable<Pagination<UserResponseDto>> {
        return from(paginate<UserResponseDto>(
            this.usersRepository, 
            options, 
            {
                where: {
                    username: Raw(usernameInDb => `LOWER(${usernameInDb}) LIKE '%${filters.username.toLowerCase()}%'`),
                    firstName: Raw(firstNameInDb => `LOWER(${firstNameInDb}) LIKE '%${filters.firstName.toLowerCase()}%'`),
                    lastName: Raw(lastNameInDb => `LOWER(${lastNameInDb}) LIKE '%${filters.lastName.toLowerCase()}%'`)
                },
                order: { createdAt: 'DESC' }
            }
        ))
    }

    findOneById(id: number): Observable<UserDto> {
        return from(this.usersRepository.findOne({where:{id}}));
    }

    findOneByEmail(email: string) : Observable<UserResponseDto> {
        return from(this.usersRepository.findOne({where:{email}}));
    }

    findOneByEmailWithPassword(email: string) : Observable<UserDto> {
        return from(this.usersRepository.findOne({where:{email}, select:['id', 'firstName', 'lastName', 'email', 'username', 'password', 'role', 'profileImage', 'createdAt']}));
    }

    findOneByUsername(username: string) : Observable<UserDto> {
        return from(this.usersRepository.findOne({where:{username}, relations: ['tags']}));
    }

    updateProfileImage(userId: number, imageName: string | null) : Observable<UserResponseDto> {
        return this.deleteProfileImageFromFileSystem(userId).pipe(
            switchMap(() => this.updateOne(userId, {profileImage: imageName})),
        );
    }

    updateOne(id: number, userData: UpdateUserDto) : Observable<UserResponseDto> {
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

    private deleteProfileImageFromFileSystem(userId: number): Observable<UserResponseDto> {
        return this.findOneById(userId).pipe(
            tap((user: UserResponseDto) => {
                if(user.profileImage !== null) {
                    const userProfileImagePath = `./uploads/profile-images/${user.profileImage}`;
                    fs.unlinkSync(userProfileImagePath);
                }
            })
        );
    }

    findTagsForUser(username: string): Observable<TagResponseDto[]> {
        if(username === '')
            return of([]);

        return from(this.usersRepository.findOne({
            where: {username},
            relations: ['tags']
        })).pipe(
            map((user: UserDto) => user.tags)
        )
    }
}
