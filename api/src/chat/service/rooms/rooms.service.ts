import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CreateRoomDto } from 'src/chat/dto/room/create-room.dto';
import { RoomResponseDto } from 'src/chat/dto/room/room-response.dto';
import { RoomDto } from 'src/chat/dto/room/room.dto';
import { RoomEntity } from 'src/chat/entities/room.entity';
import { UserDto } from 'src/users/dto/user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class RoomsService {

  constructor(
    @InjectRepository(RoomEntity)
    private roomsRepository: Repository<RoomEntity>,
  ) {}

  async createRoom(room: CreateRoomDto, creator: UserDto): Promise<RoomResponseDto> {
    room.users.push(creator);
    return this.roomsRepository.save(room);
  }

  async getRoomsForUser(userId: number, options: IPaginationOptions): Promise<Pagination<RoomResponseDto>> {
    return await paginate(this.roomsRepository, options, {
        where: {users: {id: userId }},
        order: {createdAt: 'DESC'}
    })
  }
}
