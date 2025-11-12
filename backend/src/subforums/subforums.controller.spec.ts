import { Test, TestingModule } from '@nestjs/testing';
import { SubforumsController } from './subforums.controller';
import { SubforumsService } from './subforums.service';

describe('SubforumsController', () => {
  let controller: SubforumsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubforumsController],
      providers: [SubforumsService],
    }).compile();

    controller = module.get<SubforumsController>(SubforumsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
