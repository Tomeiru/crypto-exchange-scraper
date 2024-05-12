import { Module } from '@nestjs/common';
import { TokensController } from './tokens.controller';
import { PrismaTokensService } from './prisma.tokens.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CoinMarketCapModule } from '../coin-market-cap/coin-market-cap.module';
import { RatesModule } from '../rates/rates.module';
import { TokensService } from './abstract.tokens.service';

@Module({
  imports: [CoinMarketCapModule, PrismaModule, RatesModule],
  controllers: [TokensController],
  providers: [
    {
      provide: TokensService,
      useClass: PrismaTokensService,
    },
  ],
  exports: [TokensService],
})
export class TokensModule {}
