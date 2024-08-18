import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { Observable, of } from 'rxjs';
import { UserResponseDto } from '../dto/user-response.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { getFileConfigurationByPath } from 'src/helpers/file-upload.helper';
import { UserRoles } from '../enums/user-roles.enum';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { SearchUsersFilters } from '../dto/search-users-filters.dto';
import { TagResponseDto } from 'src/tags/dto/tag-response.dto';

@Controller('users')
export class UsersController {

    constructor(
        private usersService: UsersService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    findManyPaginated(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
        @Query('username') username: string = '',
        @Query('firstName') firstName: string = '',
        @Query('lastName') lastName: string = ''
    ) {
        limit = Math.min(100, limit);
        const paginateOptions : IPaginationOptions = {
            limit,
            page
        }
        const usersFilters : SearchUsersFilters = {
            username,
            firstName,
            lastName
        }
        return this.usersService.findManyPaginated(paginateOptions, usersFilters);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':username')
    findOneByUsername(@Param('username') username: string) : Promise<UserResponseDto> {
        return this.usersService.findOneByUsername(username);
    }

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
    updateRoleOfUser(@Param('id') id: number, @Body() userData: UpdateUserDto) : Promise<UserResponseDto> {
        return this.usersService.updateOne(id, userData);
    }

    @Roles(UserRoles.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    deleteOne(@Param('id') id:number) : Promise<any> {
        return this.usersService.deleteOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', getFileConfigurationByPath('uploads/profile-images')))
    @Post('upload-profile-image')
    uploadProfileImage(@UploadedFile() file, @Request() req) : Promise<UserResponseDto> {
        const user = req.user;
        return this.usersService.updateProfileImage(user.id, file.filename);
    }

    @Get('profile-image/:imageName')
    getProfileImage(@Param('imageName') imageName: string, @Res() res) : Promise<Object> {
        const relativeFilePath = `uploads/profile-images/${imageName}`;
        const absoluteFilePath = path.join(process.cwd(), relativeFilePath); 
        return res.sendFile(absoluteFilePath);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':username/tags')
    findTagsForUser(@Param('username') username: string): Promise<TagResponseDto[]> {
        return this.usersService.findTagsForUser(username);
    }

    @Get('applied-to/:projectId')
    findAppliedUsersForProject(
        @Param('projectId') projectId: number,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        limit = Math.min(limit, 100);
        return this.usersService.findAppliedUsersForProject(projectId, {page, limit});
    }

    @Get('accepted-in/:projectId')
    findAcceptedUsersForProject(
        @Param('projectId') projectId: number,
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        limit = Math.min(limit, 100);
        return this.usersService.findAcceptedUsersForProject(projectId, {page, limit});
    }

    @UseGuards(JwtAuthGuard)
    @Post('enroll-user-in-project/:projectId')
    enrollUserInProject(@Param('projectId') projectId: number, @Request() req): Promise<UserResponseDto> {
      const userId = req.user.id;
      return this.usersService.enrollUserInProject(+userId, +projectId);
    }
  
    @UseGuards(JwtAuthGuard)
    @Post('unenroll-user/:projectId/:userId')
    unenrollUserFromProject(@Param('projectId') projectId: number, @Param('userId') userId: number): Promise<UserResponseDto> {
      return this.usersService.unenrollUserFromProject(+userId, +projectId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('accept-user-in-project/:projectId/:userId')
    acceptUserInProject(@Param('projectId') projectId: number, @Param('userId') userId: number): Promise<UserResponseDto> {
      return this.usersService.acceptUserInProject(+userId, +projectId);
    }
}
