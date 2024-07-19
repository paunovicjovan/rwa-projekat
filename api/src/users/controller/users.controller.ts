import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../service/users.service';
import { Observable, of } from 'rxjs';
import { ReturnUserDto } from '../dto/return-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRoles } from '../dto/user.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

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

    @Post()
    create(@Body() user: CreateUserDto) : Observable<ReturnUserDto> {
        return this.usersService.create(user);
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
}
