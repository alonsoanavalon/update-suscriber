import { Test, TestingModule } from '@nestjs/testing';
import { SuscriberController } from './suscriber.controller';

describe('SuscriberController', () => {
  let controller: SuscriberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuscriberController],
    }).compile();

    controller = module.get<SuscriberController>(SuscriberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
