import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../service/users.service';
import { Observable } from 'rxjs';
import { ReturnUserDto } from '../dto/return-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserDto } from '../dto/user.dto';

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

    @Delete(':id')
    deleteOne(@Param('id') id:number) : Observable<any> {
        return this.usersService.deleteOne(id);
    }
}
