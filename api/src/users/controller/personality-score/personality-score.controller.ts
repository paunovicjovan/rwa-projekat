import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, Req, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreatePersonalityScoreDto } from 'src/users/dto/personality-score/create-personality-score.dto';
import { PersonalityScoreResponseDto } from 'src/users/dto/personality-score/personality-score-response.dto';
import { PersonalityScoreService } from 'src/users/service/personality-score/personality-score.service';

@Controller('personality-score')
export class PersonalityScoreController {
    constructor(private personalityScoreService: PersonalityScoreService) {}

    @UseGuards(JwtAuthGuard)
    @Get('')
    async findOneByUsername(@Request() req) : Promise<PersonalityScoreResponseDto> {
        try {
            return await this.personalityScoreService.findOneByUserId(+req.user.id);
        }
        catch(err) {
            throw new HttpException('Došlo je do greške prilikom učitavanja osobina.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Put('')
    async createOrUpdate(@Body() dto: CreatePersonalityScoreDto, @Request() req) : Promise<PersonalityScoreResponseDto> {
        try {
            return await this.personalityScoreService.createOrUpdate(dto, +req.user.id);
        }
        catch(err) {
            throw new HttpException('Došlo je do greške prilikom čuvanja osobina.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
