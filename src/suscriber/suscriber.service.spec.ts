import { Test, TestingModule } from '@nestjs/testing';
import { SuscriberService } from './suscriber.service';

describe('SuscriberService', () => {
  let service: SuscriberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SuscriberService],
    }).compile();

    service = module.get<SuscriberService>(SuscriberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
