import { Test, TestingModule } from '@nestjs/testing';
import { PersonalityScoreService } from './personality-score.service';

describe('PersonalityScoreService', () => {
  let service: PersonalityScoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonalityScoreService],
    }).compile();

    service = module.get<PersonalityScoreService>(PersonalityScoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
