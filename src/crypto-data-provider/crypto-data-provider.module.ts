import { Module } from '@nestjs/common';
import { CoinMarketCapService } from './coin-market-cap.service';
import { CryptoDataProviderService } from './abstract.crypto-data-provider.service';

@Module({
  imports: [CoinMarketCapService.registerHTTPModule()],
  providers: [
    {
      provide: CryptoDataProviderService,
      useClass: CoinMarketCapService,
    },
  ],
  exports: [CryptoDataProviderService],
})
export class CryptoDataProviderModule {}
