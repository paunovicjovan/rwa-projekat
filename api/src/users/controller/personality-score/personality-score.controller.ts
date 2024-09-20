import { Body, Controller, Get, Param, Post, Put, Req, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreatePersonalityScoreDto } from 'src/users/dto/personality-score/create-personality-score.dto';
import { PersonalityScoreResponseDto } from 'src/users/dto/personality-score/personality-score-response.dto';
import { PersonalityScoreService } from 'src/users/service/personality-score/personality-score.service';

@Controller('personality-score')
export class PersonalityScoreController {
    constructor(private personalityScoreService: PersonalityScoreService) {}

    @UseGuards(JwtAuthGuard)
    @Get(':userId')
    async findOneByUsername(@Param('userId') userId: number) : Promise<PersonalityScoreResponseDto> {
        return await this.personalityScoreService.findOneByUserId(+userId);
    }

    @UseGuards(JwtAuthGuard)
    @Put('')
    async createOrUpdate(@Body() dto: CreatePersonalityScoreDto, @Request() req) : Promise<PersonalityScoreResponseDto> {
        return await this.personalityScoreService.createOrUpdate(dto, req.user.id);
    }
}
