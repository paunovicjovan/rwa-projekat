import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CreateMessageDto } from 'src/chat/dto/message/create-message.dto';
import { MessageResponseDto } from 'src/chat/dto/message/message-response.dto';
import { MessageEntity } from 'src/chat/entities/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepository: Repository<MessageEntity>,
  ) {}

  async create(message: CreateMessageDto): Promise<MessageResponseDto> {
    // return await this.messageRepository.save(this.messageRepository.create(message));
    return await this.messageRepository.save(message);
  }

  async findMessagesForRoom(roomId: number, options: IPaginationOptions): Promise<Pagination<MessageResponseDto>> {
    return paginate(this.messageRepository, options, {
      where: { room: {id: roomId }},
      relations: ['user', 'room'],
      order: { createdAt: 'ASC' }
    });
  }
}
