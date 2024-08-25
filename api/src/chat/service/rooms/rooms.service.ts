import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CreateRoomDto } from 'src/chat/dto/room/create-room.dto';
import { RoomResponseDto } from 'src/chat/dto/room/room-response.dto';
import { UpdateRoomDto } from 'src/chat/dto/room/update-room.dto';
import { RoomEntity } from 'src/chat/entities/room.entity';
import { UserDto } from 'src/users/dto/user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class RoomsService {

  constructor(
    @InjectRepository(RoomEntity)
    private roomsRepository: Repository<RoomEntity>
  ) {}

  async createRoom(room: CreateRoomDto, creator: UserDto): Promise<RoomResponseDto> {
    room.users.push(creator);
    room.createdBy = creator;
    return await this.roomsRepository.save(room);
  }

  async updateRoom(updateRoomDto: UpdateRoomDto): Promise<RoomResponseDto> {
    await this.roomsRepository.update(updateRoomDto.id, updateRoomDto);
    return await this.roomsRepository.findOne({
      where: { id: updateRoomDto.id },
      relations: ['users', 'createdBy']
    })
  }

  async findRoom(roomId: number): Promise<RoomResponseDto> {
    return await this.roomsRepository.findOne({
      where: {id: roomId},
      relations: ['users', 'createdBy']
    });
  }

  async findRoomsForUser(userId: number, options: IPaginationOptions): Promise<Pagination<RoomResponseDto>> {
    return await paginate(this.roomsRepository, options, {
        where: {
            users: { id: userId }
        },
        relations: ['users', 'createdBy'],
        order: {updatedAt: 'DESC'}
    });
  }
}
