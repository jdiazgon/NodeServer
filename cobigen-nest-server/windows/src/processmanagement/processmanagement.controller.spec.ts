import { Test, TestingModule } from '@nestjs/testing';
import { ProcessmanagementController } from './processmanagement.controller';

describe('Processmanagement Controller', () => {
  let controller: ProcessmanagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProcessmanagementController],
    }).compile();

    controller = module.get<ProcessmanagementController>(ProcessmanagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
