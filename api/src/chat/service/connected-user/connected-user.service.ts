import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedUserDto } from 'src/chat/dto/connected-user/connected-user.dto';
import { CreateConnectedUserDto } from 'src/chat/dto/connected-user/create-connected-user.dto';
import { ConnectedUserEntity } from 'src/chat/entities/connected-user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ConnectedUserService {
  constructor(
    @InjectRepository(ConnectedUserEntity)
    private connectedUserRepository: Repository<ConnectedUserEntity>,
  ) {}

  async create(connectedUser: CreateConnectedUserDto): Promise<ConnectedUserDto> {
    return await this.connectedUserRepository.save(connectedUser);
  }

  async findByUserId(userId: number): Promise<ConnectedUserDto[]> {
    return await this.connectedUserRepository.find({ 
      where: {
        user: {id: userId}
      } 
    });
  }

  async deleteBySocketId(socketId: string) {
    return await this.connectedUserRepository.delete({ socketId });
  }

  async deleteManyByUserId(userId: number) {
    return await this.connectedUserRepository.delete({ user: { id: userId } });
  }

  async deleteAll() {
    await await this.connectedUserRepository.clear();
  }
}
