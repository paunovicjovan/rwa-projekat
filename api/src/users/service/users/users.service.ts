import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { In, Not, Raw, Repository } from 'typeorm';
import { CreateUserDto } from '../../dto/user/create-user.dto';
import { UserDto } from '../../dto/user/user.dto';
import { UserResponseDto } from '../../dto/user/user-response.dto';
import { UpdateUserDto } from '../../dto/user/update-user.dto';
import * as fs from 'fs';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { SearchUsersFilters } from '../../dto/user/search-users-filters.dto';
import { ProjectsService } from 'src/projects/service/projects.service';
import { ProjectDto } from 'src/projects/dto/project.dto';
import { JoinedRoomsService } from 'src/chat/service/joined-rooms/joined-rooms.service';
import { ConnectedUserService } from 'src/chat/service/connected-user/connected-user.service';
import { ReviewsService } from 'src/reviews/service/reviews.service';
import { MessagesService } from 'src/chat/service/messages/messages.service';
import { PersonalityScoreService } from '../personality-score/personality-score.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
        @Inject(forwardRef(() => ProjectsService))
        private projectsService: ProjectsService,
        private joinedRoomsService: JoinedRoomsService,
        private connectedUserService: ConnectedUserService,
        @Inject(forwardRef(() => ReviewsService))
        private reviewsService: ReviewsService,
        private messagesService: MessagesService,
        @Inject(forwardRef(() => PersonalityScoreService))
        private personalityScoreService: PersonalityScoreService

    ) {}

    async create(user: CreateUserDto) : Promise<UserDto> {
        user.email = user.email.toLowerCase();
        user.username = user.username.toLowerCase();
        return this.usersRepository.save(user);
    }

    async findManyByName(options: IPaginationOptions, filters: SearchUsersFilters, requesterId: number) : Promise<Pagination<UserResponseDto>> {
        return paginate<UserResponseDto>(
            this.usersRepository, 
            options, 
            {
                where: {
                    id: Not(requesterId),
                    username: Raw(usernameInDb => `LOWER(${usernameInDb}) LIKE '%${filters.username.toLowerCase()}%'`),
                    firstName: Raw(firstNameInDb => `LOWER(${firstNameInDb}) LIKE '%${filters.firstName.toLowerCase()}%'`),
                    lastName: Raw(lastNameInDb => `LOWER(${lastNameInDb}) LIKE '%${filters.lastName.toLowerCase()}%'`)
                },
                order: { createdAt: 'DESC' }
            }
        )
    }

    async findManyByTags(options: IPaginationOptions, tagsIds: number[], requesterId: number): Promise<Pagination<UserResponseDto>> {
        const queryBuilder = this.usersRepository.createQueryBuilder('user')
                            .leftJoinAndSelect('user.tags', 'tag')
                            .where('tag.id IN (:...tagsIds)', { tagsIds })
                            .andWhere('user.id != :requesterId', { requesterId })
                            .orderBy('user.createdAt', 'DESC');

        return paginate<UserEntity>(queryBuilder, options);
    }

    async findSimilarUsers(requesterId: number, maxCount: number): Promise<UserResponseDto[]> {
        const similarUsersIds = await this.personalityScoreService.findSimilarUsersIds(undefined, requesterId, maxCount);
        return this.usersRepository.find({
            where: {id: In(similarUsersIds) }
        })
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

    async updateProfileImage(userId: number, newImageName: string | null) : Promise<UserResponseDto> {
        await this.deleteProfileImageFromFileSystem(userId);
        return await this.updateOne(userId, {profileImage: newImageName});
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
        const user = await this.usersRepository.findOne({
            where: {id},
            relations: ['rooms', 
                        'tags', 
                        'appliedTo', 
                        'acceptedIn',
                        'createdRooms'
            ]
        })
        user.rooms = [];
        user.tags = [];
        user.appliedTo = [];
        user.acceptedIn = [];
        user.createdRooms = [];

        await this.usersRepository.save(user);

        await this.projectsService.deleteManyByAuthorId(id);
        await this.reviewsService.deleteManyByAuthorId(id);
        await this.reviewsService.deleteManyByRevieweeId(id);
        await this.connectedUserService.deleteManyByUserId(id);
        await this.joinedRoomsService.deleteManyByUserId(id);
        await this.messagesService.deleteManyByUserId(id);
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

    async enrollUserInProject(userId: number, projectId: number): Promise<UserResponseDto> {
        const project = await this.projectsService.findOne(projectId);
        const user = await this.usersRepository.findOne({
            where: {id: userId},
            relations: ['appliedTo']
        });
        user.appliedTo.push(project);
        return await this.usersRepository.save(user);
    }

    async unenrollUserFromProject(userId: number, projectId: number): Promise<UserResponseDto> {
        const user = await this.usersRepository.findOne({
            where: {id: userId},
            relations: ['appliedTo', 'acceptedIn']
        })
        user.appliedTo = user.appliedTo.filter((project: ProjectDto) => project.id !== projectId);
        user.acceptedIn = user.acceptedIn.filter((project: ProjectDto) => project.id !== projectId);
        return await this.usersRepository.save(user);
    }

    async acceptUserInProject(userId: number, projectId: number): Promise<UserResponseDto> {
        const user = await this.usersRepository.findOne({
            where: {id: userId},
            relations: ['appliedTo', 'acceptedIn']
        });
        const project = await this.projectsService.findOne(projectId);
        user.appliedTo = user.appliedTo.filter((project: ProjectDto) => project.id !== projectId);
        user.acceptedIn.push(project);
        return await this.usersRepository.save(user);
    }

    async inviteUserToProject(userId: number, projectId: number): Promise<UserResponseDto> {
        const user = await this.usersRepository.findOne({
            where: {id: userId},
            relations: ['appliedTo', 'acceptedIn', 'invitedTo']
        });
        const project = await this.projectsService.findOne(projectId);
        if(user.acceptedIn.includes(project))
            throw new Error('Korisnik se već nalazi na projektu. Nemoguće slanje pozivnice.')
        if(user.appliedTo.includes(project))
            throw new Error('Korisnik se već prijavio za projekat. Nemoguće slanje pozivnice.')
        user.invitedTo.push(project);
        return await this.usersRepository.save(user);
    }

    async acceptProjectInvitation(userId: number, projectId: number): Promise<UserResponseDto> {
        const user = await this.usersRepository.findOne({
            where: {id: userId},
            relations: ['acceptedIn', 'invitedTo']
        })
        const project = await this.projectsService.findOne(projectId);
        user.appliedTo = user.appliedTo.filter((project: ProjectDto) => project.id !== projectId);
        user.invitedTo = user.invitedTo.filter((project: ProjectDto) => project.id !== projectId);
        user.acceptedIn.push(project);
        return await this.usersRepository.save(user);
    }

    async declineProjectInvitation(userId: number, projectId: number): Promise<UserResponseDto> {
        const user = await this.usersRepository.findOne({
            where: {id: userId},
            relations: ['invitedTo']
        })
        user.invitedTo = user.invitedTo.filter((project: ProjectDto) => project.id !== projectId);
        return await this.usersRepository.save(user);
    }

    async findAllUsersForRoom(roomId: number): Promise<UserDto[]> {
        return await this.usersRepository.find({
            where: { rooms: { id: roomId }}
        })
    }

    async findSuggestedCollaborators(projectId: number, requesterId: number, maxCount: number): Promise<UserResponseDto[]> {
        const project = await this.projectsService.findOneWithAllRelations(projectId);
        const projectTagsIds = project.tags.map(tag => tag.id);
        const projectAcceptedUsersIds = project.acceptedUsers.map(user => user.id);
        const projectInvitedUsersIds = project.invitedUsers.map(user => user.id);
        
        const possibleByTagsUsersObjects = await this.usersRepository
                                            .createQueryBuilder('user')
                                            .innerJoin('user.tags', 'tag')
                                            .where('tag.id IN (:...projectTagsIds)', { projectTagsIds })
                                            .select('user.id')
                                            .distinct(true)
                                            .getRawMany();
            
        const possibleUsersIds = possibleByTagsUsersObjects
                                .map(user => user.user_id)
                                .filter(userId => !projectAcceptedUsersIds.includes(userId) &&
                                                  !projectInvitedUsersIds.includes(userId));

        const suggestedUsersIds = await this.personalityScoreService
                                        .findSimilarUsersIds(possibleUsersIds, requesterId, maxCount);

        return this.usersRepository.find({
            where: {id: In(suggestedUsersIds) }
        })
    }
}
