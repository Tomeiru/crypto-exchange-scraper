import { Test, TestingModule } from '@nestjs/testing';
import { AbstractCryptoDataProviderService } from './abstract.crypto-data-provider.service';

describe('CryptoDataProviderService', () => {
  let service: AbstractCryptoDataProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AbstractCryptoDataProviderService],
    }).compile();

    service = module.get<AbstractCryptoDataProviderService>(
      AbstractCryptoDataProviderService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
