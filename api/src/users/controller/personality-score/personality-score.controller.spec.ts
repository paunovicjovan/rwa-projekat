import { Test, TestingModule } from '@nestjs/testing';
import { PersonalityScoreController } from './personality-score.controller';

describe('PersonalityScoreController', () => {
  let controller: PersonalityScoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonalityScoreController],
    }).compile();

    controller = module.get<PersonalityScoreController>(PersonalityScoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
