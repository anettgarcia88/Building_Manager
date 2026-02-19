import { Test, TestingModule } from '@nestjs/testing';
import { ClosingService } from './closing.service';

describe('ClosingService', () => {
  let service: ClosingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClosingService],
    }).compile();

    service = module.get<ClosingService>(ClosingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
