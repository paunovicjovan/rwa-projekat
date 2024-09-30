import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PersonalityScoreEntity } from '../../entities/personality-score.entity';
import { In, Not, Raw, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreatePersonalityScoreDto } from '../../dto/personality-score/create-personality-score.dto';
import { PersonalityScoreResponseDto } from '../../dto/personality-score/personality-score-response.dto';
import { UpdatePersonalityScoreDto } from '../../dto/personality-score/update-personality-score.dto';
import { PersonalityScoreDto } from 'src/users/dto/personality-score/personality-score.dto';

@Injectable()
export class PersonalityScoreService {

    constructor(
        @InjectRepository(PersonalityScoreEntity)
        private personalityScoreRepository: Repository<PersonalityScoreEntity>,
        @Inject(forwardRef(() => UsersService))
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

    async findSimilarUsersIds(possibleUsersIds: number[] | undefined, requesterId: number, maxCount: number): Promise<number[]> {
        if(possibleUsersIds?.length == 0)
            return [];

        const requesterScore = await this.personalityScoreRepository.findOne({
          where: { user: { id: requesterId } }
        });

        if(!requesterScore)
            return [];

        let whereCondition;

        if (possibleUsersIds == undefined) {
            whereCondition = {
                user: { 
                    id: Raw((userId) => `${userId} != :requesterId`, { requesterId })
                }
            };
        } else {
            whereCondition = {
                user: {
                    id: Raw((userId) => `${userId} IN (:...possibleUsersIds) AND ${userId} != :requesterId`, {
                        possibleUsersIds,
                        requesterId
                    })
                }
            };
        }
        
        const possibleScoresIds = (await this.personalityScoreRepository.find({
                                    where: whereCondition,
                                    select: ['id']
                                   }))
                                   .map((score) => score.id);
        

        const numberOfSamples = 1000;
        const chosenScoresIds = this.chooseRandomScoresIds(possibleScoresIds, numberOfSamples);
        const closestScores = await this.findClosestScores(chosenScoresIds, requesterScore, maxCount);
        const similarUsersIds = closestScores.map(score => score.user.id);
        return similarUsersIds;
    }

    chooseRandomScoresIds(allScoresIds: number[], numberOfSamples: number): number[] {
        let chosenSamplesIds = [];

        if(allScoresIds.length <= numberOfSamples) {
            chosenSamplesIds = allScoresIds;
        }
        else {
            //shuffle array and pick first numberOfSamples elements from it
            for (let i = allScoresIds.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allScoresIds[i], allScoresIds[j]] = [allScoresIds[j], allScoresIds[i]];
            }
            chosenSamplesIds = allScoresIds.slice(0, numberOfSamples);
        }

        return chosenSamplesIds;
    }

    async findClosestScores(scoresIds: number[], targetScore: PersonalityScoreDto, maxCount: number): Promise<PersonalityScoreResponseDto[]> {
        const scores = await this.personalityScoreRepository.find({
          where: { id: In(scoresIds) },
          relations: ['user'],
        });
  
        //sort ascending and pick first maxCount elements
        return scores
          .map((score) => ({
            score,
            distance: this.calculateDistanceBetweenScores(targetScore, score),
          }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, maxCount)
          .map(item => item.score);
    }


    calculateDistanceBetweenScores(score1: PersonalityScoreDto, score2: PersonalityScoreDto): number {
        const traits = [
            'adaptability', 
            'extroversion', 
            'independence', 
            'workMotivation', 
            'deadlineCommitment', 
            'detailCommitment', 
            'preferredTeamSize', 
            'liveCommunication', 
            'innovativeness'
        ];
    
        const distanceSquared = traits.reduce((sum, trait) => {
            return sum + Math.pow(score1[trait] - score2[trait], 2);
        }, 0);
    
        return Math.sqrt(distanceSquared);
    }

    async deleteByUserId(userId: number): Promise<any> {
        return await this.personalityScoreRepository.delete({user: {id: userId}});
    }
    
}
