import { Module } from '@nestjs/common';
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CoinMarketCapModule } from '../coin-market-cap/coin-market-cap.module';
import { RatesModule } from '../rates/rates.module';

@Module({
  imports: [CoinMarketCapModule, PrismaModule, RatesModule],
  controllers: [TokensController],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
