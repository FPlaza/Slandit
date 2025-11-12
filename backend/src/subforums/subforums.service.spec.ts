import { Test, TestingModule } from '@nestjs/testing';
import { SubforumsService } from './subforums.service';

describe('SubforumsService', () => {
  let service: SubforumsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubforumsService],
    }).compile();

    service = module.get<SubforumsService>(SubforumsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
