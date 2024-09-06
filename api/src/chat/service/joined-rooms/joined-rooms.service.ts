import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateJoinedRoomDto } from 'src/chat/dto/joined-room/create-joined-room.dto';
import { JoinedRoomResponseDto } from 'src/chat/dto/joined-room/joined-room-response.dto';
import { UpdateRoomMembershipDto } from 'src/chat/dto/room/update-room-membership.dto';
import { JoinedRoomEntity } from 'src/chat/entities/joined-room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JoinedRoomsService {
  constructor(
    @InjectRepository(JoinedRoomEntity)
    private joinedRoomRepository: Repository<JoinedRoomEntity>,
  ) {}

  async create(joinedRoom: CreateJoinedRoomDto): Promise<JoinedRoomResponseDto> {
    const existingJoinedRoom = await this.joinedRoomRepository.findOne({where: { socketId: joinedRoom.socketId }});
    if(existingJoinedRoom)
      return existingJoinedRoom;

    return await this.joinedRoomRepository.save(joinedRoom);
  }

  async findByRoomId(roomId: number): Promise<JoinedRoomResponseDto[]> {
    return await this.joinedRoomRepository.find({ where: { room: { id: roomId } } });
  }

  async deleteByUserAndRoom(dto: UpdateRoomMembershipDto): Promise<any> {
    return await this.joinedRoomRepository.delete({ 
      user: dto.user, 
      room: {
        id: dto.roomId
      } 
    });
  }

  async deleteBySocketId(socketId: string): Promise<any> {
    return await this.joinedRoomRepository.delete({ socketId });
  }

  async deleteManyByUserId(userId: number): Promise<any> {
    return await this.joinedRoomRepository.delete({ user: { id: userId } });
  }

  async deleteAll(): Promise<any> {
    return await this.joinedRoomRepository.clear();
  }
}
