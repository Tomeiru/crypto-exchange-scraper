import { Module } from '@nestjs/common';
import { TokensModule } from '../tokens/tokens.module';
import { RatesModule } from '../rates/rates.module';
import { ScrapingService } from './scraping.service';
import { CryptoDataProviderModule } from '../crypto-data-provider/crypto-data-provider.module';

@Module({
  imports: [CryptoDataProviderModule, TokensModule, RatesModule],
  providers: [ScrapingService],
})
export class ScrapingModule {}
