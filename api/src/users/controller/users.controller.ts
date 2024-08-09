import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { Observable, of } from 'rxjs';
import { ReturnUserDto } from '../dto/return-user.dto';
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
import { TagDto } from 'src/tags/dto/tag.dto';
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
    findOneByUsername(@Param('username') username: string) : Observable<ReturnUserDto> {
        return this.usersService.findOneByUsername(username);
    }

    @Put(':id')
    updateOne(@Param('id') id: number, @Body() userData: UpdateUserDto) : Observable<ReturnUserDto> {
        return this.usersService.updateOne(id, userData);
    }

    @Roles(UserRoles.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put('/role/:id')
    updateRoleOfUser(@Param('id') id: number, @Body() userData: UpdateUserDto) : Observable<ReturnUserDto> {
        return this.usersService.updateOne(id, userData);
    }

    @Roles(UserRoles.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    deleteOne(@Param('id') id:number) : Observable<any> {
        return this.usersService.deleteOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', getFileConfigurationByPath('uploads/profile-images')))
    @Post('upload-profile-image')
    uploadProfileImage(@UploadedFile() file, @Request() req) : Observable<ReturnUserDto> {
        const user = req.user;
        return this.usersService.updateProfileImage(user.id, file.filename);
    }

    @Get('profile-image/:imageName')
    getProfileImage(@Param('imageName') imageName: string, @Res() res) : Observable<Object> {
        const relativeFilePath = `uploads/profile-images/${imageName}`;
        const absoluteFilePath = path.join(process.cwd(), relativeFilePath); 
        return of(res.sendFile(absoluteFilePath));
    }

    @UseGuards(JwtAuthGuard)
    @Get(':username/tags')
    findTagsForUser(@Param('username') username: string): Observable<TagResponseDto[]> {
        return this.usersService.findTagsForUser(username);
    }
}
