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
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
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
        limit = Math.min(100, limit);
        const usersFilters : SearchUsersFilters = {
            username,
            firstName,
            lastName
        }
        const requesterId = req.user.id;
        return await this.usersService.findManyByName({ page, limit }, usersFilters, +requesterId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('search-by-tags')
    async findManyByTags(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('tagsIds') tagsIdsSerialized: string = '',
        @Request() req
    ) {
        limit = Math.min(100, limit);

        const tagsIds = tagsIdsSerialized
                        .split(',')
                        .map(id => Number(id));

        const requesterId = req.user.id;

        return await this.usersService.findManyByTags({ page, limit }, tagsIds, +requesterId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('find-similar-users')
    async findSimilarUsers(@Request() req): Promise<UserResponseDto[]> {
        return await this.usersService.findSimilarUsers(+req.user.id, 10);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':username')
    async findOneByUsername(@Param('username') username: string) : Promise<UserResponseDto> {
        return await this.usersService.findOneByUsername(username);
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
        return await this.usersService.updateOne(id, userData);
    }

    @Roles(UserRoles.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async deleteOne(@Param('id') id:number) : Promise<any> {
        return await this.usersService.deleteOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', getFileConfigurationByPath('uploads/profile-images')))
    @Post('upload-profile-image')
    async uploadProfileImage(@UploadedFile() file, @Request() req) : Promise<UserResponseDto> {
        const user = req.user;
        return await this.usersService.updateProfileImage(user.id, file.filename);
    }

    @Get('profile-image/:imageName')
    getProfileImage(@Param('imageName') imageName: string, @Res() res) : Promise<Object> {
        const relativeFilePath = `uploads/profile-images/${imageName}`;
        const absoluteFilePath = path.join(process.cwd(), relativeFilePath); 
        return res.sendFile(absoluteFilePath);
    }

    @UseGuards(JwtAuthGuard)
    @Get('applied-to/:projectId')
    async findAppliedUsersForProject(
        @Param('projectId') projectId: number,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        limit = Math.min(limit, 100);
        return await this.usersService.findAppliedUsersForProject(projectId, {page, limit});
    }

    @UseGuards(JwtAuthGuard)
    @Get('accepted-in/:projectId')
    async findAcceptedUsersForProject(
        @Param('projectId') projectId: number,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        limit = Math.min(limit, 100);
        return await this.usersService.findAcceptedUsersForProject(projectId, {page, limit});
    }

    @UseGuards(JwtAuthGuard)
    @Post('enroll-user-in-project/:projectId')
    async enrollUserInProject(@Param('projectId') projectId: number, @Request() req): Promise<UserResponseDto> {
      const userId = req.user.id;
      return await this.usersService.enrollUserInProject(+userId, +projectId);
    }
  
    @UseGuards(JwtAuthGuard)
    @Post('unenroll-user/:projectId/:userId')
    async unenrollUserFromProject(@Param('projectId') projectId: number, @Param('userId') userId: number): Promise<UserResponseDto> {
      return await this.usersService.unenrollUserFromProject(+userId, +projectId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('accept-user-in-project/:projectId/:userId')
    async acceptUserInProject(@Param('projectId') projectId: number, @Param('userId') userId: number): Promise<UserResponseDto> {
      return await this.usersService.acceptUserInProject(+userId, +projectId);
    }
}
