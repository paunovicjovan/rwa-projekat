import { Body, Controller, Delete, Get, Param, Post, Put, Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../service/users.service';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { ReturnUserDto } from '../dto/return-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { getFileConfigurationByPath } from 'src/helpers/file-upload.helper';
import { UserRoles } from '../enums/user-roles.enum';

@Controller('users')
export class UsersController {

    constructor(
        private usersService: UsersService
    ) {}

    @Get()
    findAll() : Observable<ReturnUserDto[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOneById(@Param('id') id: number) : Observable<ReturnUserDto> {
        return this.usersService.findOneById(id);
    }

    @Put(':id')
    updateOne(@Param('id') id: number, @Body() userData: UpdateUserDto) : Observable<ReturnUserDto> {
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
}
