import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CoinMarketCapService } from './coin-market-cap.service';
import { CryptoDataProviderService } from './abstract.crypto-data-provider.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const apiKey = configService.get<string>('COIN_MARKET_CAP_API_KEY');
        if (!apiKey) {
          throw Error(
            "can't load CoinMarketCapModule as 'COIN_MARKET_CAP_API_KEY' hasn't been set.",
          );
        }
        return {
          baseURL: 'https://pro-api.coinmarketcap.com/v2/',
          headers: {
            'X-CMC_PRO_API_KEY': configService.get<string>(
              'COIN_MARKET_CAP_API_KEY',
            ),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: CryptoDataProviderService,
      useClass: CoinMarketCapService,
    },
  ],
  exports: [CryptoDataProviderService],
})
export class CryptoDataProviderModule {}
