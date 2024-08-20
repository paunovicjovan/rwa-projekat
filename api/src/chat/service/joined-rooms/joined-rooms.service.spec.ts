import { Test, TestingModule } from '@nestjs/testing';
import { JoinedRoomsService } from './joined-rooms.service';

describe('JoinedRoomsService', () => {
  let service: JoinedRoomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JoinedRoomsService],
    }).compile();

    service = module.get<JoinedRoomsService>(JoinedRoomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
