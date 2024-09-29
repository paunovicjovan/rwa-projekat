import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from '../../service/users/users.service';
import { UserResponseDto } from '../../dto/user/user-response.dto';
import { UpdateUserDto } from '../../dto/user/update-user.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { getFileConfigurationByPath } from 'src/helpers/file-upload.helper';
import { UserRoles } from '../../enums/user-roles.enum';
import { SearchUsersFilters } from '../../dto/user/search-users-filters.dto';
import { UserIsOwnerGuard } from '../../guards/user-is-owner/user-is-owner.guard';

@Controller('users')
export class UsersController {

    constructor(
        private usersService: UsersService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async findManyByName(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('username') username: string = '',
        @Query('firstName') firstName: string = '',
        @Query('lastName') lastName: string = '',
        @Request() req
    ) {
        try {

            limit = Math.min(100, limit);
            const usersFilters : SearchUsersFilters = {
                username,
                firstName,
                lastName
            }
            const requesterId = req.user.id;
            return await this.usersService.findManyByName({ page, limit }, usersFilters, +requesterId);
        }
        catch(err) {
            throw new HttpException('Došlo je do greške prilikom učitavanja korisnika.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('search-by-tags')
    async findManyByTags(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('tagsIdsSerialized') tagsIdsSerialized: string = '',
        @Request() req
    ) {
        try {
            limit = Math.min(100, limit);

            const tagsIds = tagsIdsSerialized
                            .split(',')
                            .map(id => Number(id));

            const requesterId = req.user.id;

            return await this.usersService.findManyByTags({ page, limit }, tagsIds, +requesterId);
        }
        catch(err) {
            throw new HttpException('Došlo je do greške prilikom učitavanja korisnika.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('find-similar-users')
    async findSimilarUsers(@Request() req): Promise<UserResponseDto[]> {
        try {
            return await this.usersService.findSimilarUsers(+req.user.id, 10);
        }
        catch(err) {
            throw new HttpException('Došlo je do greške prilikom učitavanja korisnika.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get(':username')
    async findOneByUsername(@Param('username') username: string) : Promise<UserResponseDto> {
        try {
            return await this.usersService.findOneByUsername(username);
        }
        catch(err) {
            throw new HttpException('Došlo je do greške prilikom učitavanja podataka o korisniku.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(JwtAuthGuard, UserIsOwnerGuard)
    @Put(':id')
    async updateOne(@Param('id') id: number, @Body() userData: UpdateUserDto) : Promise<UserResponseDto> {
        try {
            return await this.usersService.updateOne(+id, userData);
        }
        catch(err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Roles(UserRoles.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put('/role/:id')
    async updateRoleOfUser(@Param('id') id: number, @Body() userData: UpdateUserDto) : Promise<UserResponseDto> {
        try {
            return await this.usersService.updateOne(id, userData);
        }
        catch(err) {
            throw new HttpException('Došlo je do greške prilikom izmene uloge korisnika.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Roles(UserRoles.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteOne(@Param('id') id:number) : Promise<any> {
        try {
            return await this.usersService.deleteOne(id);
        }
        catch(err) {
            throw new HttpException('Došlo je do greške prilikom brisanja podataka o korisniku.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', getFileConfigurationByPath('uploads/profile-images')))
    @Post('upload-profile-image')
    async uploadProfileImage(@UploadedFile() file, @Request() req) : Promise<UserResponseDto> {
        try {
            const user = req.user;
            return await this.usersService.updateProfileImage(user.id, file.filename);
        }
        catch(err) {
            throw new HttpException('Došlo je do greške prilikom promene profilne slike.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('profile-image/:imageName')
    getProfileImage(@Param('imageName') imageName: string, @Res() res) : Promise<Object> {
        try {
            const relativeFilePath = `uploads/profile-images/${imageName}`;
            const absoluteFilePath = path.join(process.cwd(), relativeFilePath); 
            return res.sendFile(absoluteFilePath);
        }
        catch(err) {
            throw new HttpException('Došlo je do greške prilikom učitavanja profilne slike.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('applied-to/:projectId')
    async findAppliedUsersForProject(
        @Param('projectId') projectId: number,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        try {
            limit = Math.min(limit, 100);
            return await this.usersService.findAppliedUsersForProject(projectId, {page, limit});
        }
        catch(err) {
            throw new HttpException('Došlo je do greške prilikom učitavanja korisnika.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('accepted-in/:projectId')
    async findAcceptedUsersForProject(
        @Param('projectId') projectId: number,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        try {
            limit = Math.min(limit, 100);
            return await this.usersService.findAcceptedUsersForProject(projectId, {page, limit});
        }
        catch(err) {
            throw new HttpException('Došlo je do greške prilikom učitavanja korisnika.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('enroll-user-in-project/:projectId')
    async enrollUserInProject(@Param('projectId') projectId: number, @Request() req): Promise<UserResponseDto> {
      const userId = req.user.id;
      try {
          return await this.usersService.enrollUserInProject(+userId, +projectId);
      }
      catch(err) {
        throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
      }
    }
  
    @UseGuards(JwtAuthGuard)
    @Post('unenroll-user/:projectId/:userId')
    async unenrollUserFromProject(@Param('projectId') projectId: number, @Param('userId') userId: number): Promise<UserResponseDto> {
        try {
            return await this.usersService.unenrollUserFromProject(+userId, +projectId);
        }
        catch(err) {
            throw new HttpException('Došlo je do greške prilikom odjave korisnika sa projekta.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('accept-user-in-project/:projectId/:userId')
    async acceptUserInProject(@Param('projectId') projectId: number, @Param('userId') userId: number): Promise<UserResponseDto> {
        try {
            return await this.usersService.acceptUserInProject(+userId, +projectId);
        }
        catch(err) {
            throw new HttpException('Došlo je do greške prilikom prihvatanja korisnika na projekat.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('invite-user-to-project/:projectId/:userId')
    async inviteUserToProject(@Param('projectId') projectId: number, @Param('userId') userId: number): Promise<UserResponseDto> {
        try {
            return await this.usersService.inviteUserToProject(+userId, +projectId);
        }
        catch(err) {
            throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('accept-project-invitation/:projectId')
    async acceptProjectInvitation(@Param('projectId') projectId: number, @Request() req): Promise<UserResponseDto> {
        try {
            return await this.usersService.acceptProjectInvitation(+req.user.id, +projectId);
        }
        catch(err) {
            throw new HttpException('Došlo je do greške prilikom prihvatanja pozivnice za projekat.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('cancel-project-invitation/:projectId/:userId')
    async cancelProjectInvitation(@Param('projectId') projectId: number, @Param('userId') userId: number): Promise<UserResponseDto> {
        try {
            return await this.usersService.cancelProjectInvitation(+userId, +projectId);
        }
        catch(err) {
            throw new HttpException('Došlo je do greške prilikom odbijanja pozivnice za projekat.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('find-suggested-collaborators/:projectId')
    async findSuggestedCollaborators(@Param('projectId') projectId: number, @Request() req): Promise<UserResponseDto[]> {
        try {
            return await this.usersService.findSuggestedCollaborators(+projectId, +req.user.id, 10);
        }
        catch(err) {
            throw new HttpException('Došlo je do greške prilikom učitavanja podataka o korisnicima.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('find-invited-users/:projectId')
    async findInvitedUsersForProject(
        @Param('projectId') projectId: number,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        try {
            limit = Math.min(limit, 100);
            return await this.usersService.findInvitedUsersForProject(projectId, {page, limit});
        }
        catch(err) {
            throw new HttpException('Došlo je do greške prilikom učitavanja pozvanih korisnika.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('get-invitations-count')
    async getInvitationsCount(@Request() req): Promise<number> {
        try {
            return await this.usersService.getInvitationsCountForUser(+req.user.id);
        }
        catch(err) {
            throw new HttpException('Došlo je do greške prilikom učitavanja broja pozivnica.', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
