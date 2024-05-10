import { Module } from '@nestjs/common';
import { CoinMarketCapModule } from '../coin-market-cap/coin-market-cap.module';
import { TokensModule } from '../tokens/tokens.module';
import { RatesModule } from '../rates/rates.module';
import { ScrapingService } from './scraping.service';

@Module({
  imports: [CoinMarketCapModule, TokensModule, RatesModule],
  providers: [ScrapingService],
})
export class ScrapingModule {}
