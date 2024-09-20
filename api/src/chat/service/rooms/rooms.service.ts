import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CreateRoomDto } from 'src/chat/dto/room/create-room.dto';
import { RoomResponseDto } from 'src/chat/dto/room/room-response.dto';
import { UpdateRoomMembershipDto } from 'src/chat/dto/room/update-room-membership.dto';
import { UpdateRoomDto } from 'src/chat/dto/room/update-room.dto';
import { RoomEntity } from 'src/chat/entities/room.entity';
import { UserDto } from 'src/users/dto/user/user.dto';
import { Repository } from 'typeorm';
import { JoinedRoomsService } from '../joined-rooms/joined-rooms.service';
import { MessagesService } from '../messages/messages.service';

@Injectable()
export class RoomsService {

  constructor(
    @InjectRepository(RoomEntity)
    private roomsRepository: Repository<RoomEntity>,
    private joinedRoomsService: JoinedRoomsService,
    private messagesService: MessagesService
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

  async addUserToRoom(dto: UpdateRoomMembershipDto): Promise<RoomResponseDto> {
    const room = await this.roomsRepository.findOne({
      where: {id: dto.roomId},
      relations: ['users', 'createdBy']
    });
    room.users.push(dto.user);
    await this.roomsRepository.save(room);
    return room;
  }

  async removeUserFromRoom(dto: UpdateRoomMembershipDto): Promise<RoomResponseDto> {
    const room = await this.roomsRepository.findOne({
      where: {id: dto.roomId},
      relations: ['users', 'createdBy']
    });
    room.users = room.users.filter(user => user.id !== dto.user.id);
    if(room.createdBy && room.createdBy.id === dto.user.id)
      room.createdBy = null;

    await this.roomsRepository.save(room);
    await this.joinedRoomsService.deleteByUserAndRoom(dto);
    return room;
  }

  async deleteRoom(roomId: number): Promise<any> {
    const room = await this.roomsRepository.findOne({
      where: {id: roomId},
      relations: ['users']
    });
    room.users = [];
    await this.roomsRepository.save(room);
    await this.joinedRoomsService.deleteManyByRoomId(roomId);
    await this.messagesService.deleteManyByRoomId(roomId);
    return await this.roomsRepository.delete({ id: roomId });
  }
}
