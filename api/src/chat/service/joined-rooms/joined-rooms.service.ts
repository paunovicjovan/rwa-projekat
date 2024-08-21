import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateJoinedRoomDto } from 'src/chat/dto/joined-room/create-joined-room.dto';
import { JoinedRoomResponseDto } from 'src/chat/dto/joined-room/joined-room-response.dto';
import { RoomDto } from 'src/chat/dto/room/room.dto';
import { JoinedRoomEntity } from 'src/chat/entities/joined-room.entity';
import { UserDto } from 'src/users/dto/user.dto';
import { Repository } from 'typeorm';

@Injectable()
export class JoinedRoomsService {
  constructor(
    @InjectRepository(JoinedRoomEntity)
    private joinedRoomRepository: Repository<JoinedRoomEntity>,
  ) {}

  async create(joinedRoom: CreateJoinedRoomDto): Promise<JoinedRoomResponseDto> {
    return await this.joinedRoomRepository.save(joinedRoom);
  }

  async findByRoomId(roomId: number): Promise<JoinedRoomResponseDto[]> {
    return await this.joinedRoomRepository.find({ where: { room: { id: roomId } } });
  }

  async deleteBySocketId(socketId: string): Promise<any> {
    return await this.joinedRoomRepository.delete({ socketId });
  }

  async deleteAll(): Promise<any> {
    return await this.joinedRoomRepository.clear();
  }
}
