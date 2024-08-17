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

    async create(user: CreateUserDto) : Promise<UserDto> {
        user.email = user.email.toLowerCase();
        user.username = user.username.toLowerCase();
        return this.usersRepository.save(user);
    }

    async findManyPaginated(options: IPaginationOptions, filters: SearchUsersFilters) : Promise<Pagination<UserResponseDto>> {
        return paginate<UserResponseDto>(
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
        )
    }

    async findOneById(id: number): Promise<UserDto> {
        return this.usersRepository.findOne({where:{id}});
    }

    async findOneByEmail(email: string) : Promise<UserResponseDto> {
        return this.usersRepository.findOne({where:{email}});
    }

    async findOneByEmailWithPassword(email: string) : Promise<UserDto> {
        return this.usersRepository.findOne({
            where:{email}, 
            select:['id', 'firstName', 'lastName', 'email', 'username', 'password', 'role', 'profileImage', 'createdAt']});
    }

    async findOneByUsername(username: string) : Promise<UserDto> {
        return this.usersRepository.findOne({where:{username}, relations: ['tags']});
    }

    async updateProfileImage(userId: number, imageName: string | null) : Promise<UserResponseDto> {
        await this.deleteProfileImageFromFileSystem(userId);
        return await this.updateOne(userId, {profileImage: imageName});
    }

    async updateOne(id: number, userData: UpdateUserDto) : Promise<UserResponseDto> {
        if(userData.username) {
            const existingUserByUsername = await this.findOneByUsername(userData.username);
            if(existingUserByUsername && existingUserByUsername.id !== id)
                throw new Error('Izabrano korisničko ime je zauzeto.');
        }
        await this.usersRepository.update(id, userData);
        return await this.findOneById(id);
    }

    async deleteOne(id: number) : Promise<any> {
        await this.deleteProfileImageFromFileSystem(id);
        return await this.usersRepository.delete(id);
    }

    private async deleteProfileImageFromFileSystem(userId: number): Promise<UserResponseDto> {
        const user = await this.findOneById(userId);
        if(user.profileImage !== null) {
            const userProfileImagePath = `./uploads/profile-images/${user.profileImage}`;
            fs.unlinkSync(userProfileImagePath);
        }
        return user;
    }

    async findTagsForUser(username: string): Promise<TagResponseDto[]> {
        if(username === '')
            return [];

        const user = await this.usersRepository.findOne({
            where: {username},
            relations: ['tags']
        });
        return user.tags;
    }

    async findTagsIdsForUser(userId: number): Promise<number[]> {
        const user = await this.usersRepository.findOne({
            where: {id: userId},
            relations: ['tags']
        });
        return user.tags.map(tag => tag.id);
    }

    async findAppliedUsersForProject(projectId: number, options: IPaginationOptions): Promise<Pagination<UserResponseDto>> {
        const queryBuilder = this.usersRepository
                            .createQueryBuilder('user')
                            .innerJoin('user.appliedTo', 'appliedTo')
                            .where('appliedTo.id = :projectId', {projectId});

        return paginate(queryBuilder, options);
    }

    async findAcceptedUsersForProject(projectId: number, options: IPaginationOptions): Promise<Pagination<UserResponseDto>> {
        const queryBuilder = this.usersRepository
                            .createQueryBuilder('user')
                            .innerJoin('user.acceptedIn', 'acceptedIn')
                            .where('acceptedIn.id = :projectId', {projectId});

        return paginate(queryBuilder, options);
    }
}
