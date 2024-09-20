import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonalityScoreEntity } from '../../entities/personality-score.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreatePersonalityScoreDto } from '../../dto/personality-score/create-personality-score.dto';
import { PersonalityScoreResponseDto } from '../../dto/personality-score/personality-score-response.dto';
import { UpdatePersonalityScoreDto } from '../../dto/personality-score/update-personality-score.dto';

@Injectable()
export class PersonalityScoreService {

    constructor(
        @InjectRepository(PersonalityScoreEntity)
        private personalityScoreRepository: Repository<PersonalityScoreEntity>,
        private usersService: UsersService
    ) {}

    async createOrUpdate(dto: CreatePersonalityScoreDto, userId: number): Promise<PersonalityScoreResponseDto> {
        const existingPersonalityScore = await this.findOneByUserId(userId);

        if(!existingPersonalityScore) {
            return await this.create(dto, userId);
        }
        else {
            return await this.update(existingPersonalityScore.id, dto);
        }
    }
    
    async findOneByUserId(userId: number): Promise<PersonalityScoreResponseDto> {
        return await this.personalityScoreRepository.findOne({
            where: {
                user: {
                    id: userId
                }
            },
            relations: ['user']
        });
    }

    async create(dto: CreatePersonalityScoreDto, userId: number): Promise<PersonalityScoreResponseDto> {
        const user = await this.usersService.findOneById(userId);
        const personalityScoreEntity = this.personalityScoreRepository.create(dto);
        personalityScoreEntity.user = user;
        return await this.personalityScoreRepository.save(personalityScoreEntity);
    }

    async update(id: number, dto: UpdatePersonalityScoreDto): Promise<PersonalityScoreResponseDto> {
        await this.personalityScoreRepository.update(id, dto);
        return await this.findOneById(id);
    }

    async findOneById(id: number): Promise<PersonalityScoreResponseDto> {
        return await this.personalityScoreRepository.findOne({ 
            where: { id },
            relations: ['user'] 
        });
    }
    
}
