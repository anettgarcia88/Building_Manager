import { Test, TestingModule } from '@nestjs/testing';
import { LaundryController } from './laundry.controller';

describe('LaundryController', () => {
  let controller: LaundryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LaundryController],
    }).compile();

    controller = module.get<LaundryController>(LaundryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
