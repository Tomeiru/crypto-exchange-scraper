import { Test, TestingModule } from '@nestjs/testing';
import { PrismaRatesService } from './prisma.rates.service';

describe('RatesService', () => {
  let service: PrismaRatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaRatesService],
    }).compile();

    service = module.get<PrismaRatesService>(PrismaRatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
