import { Module } from '@nestjs/common';
import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CoinMarketCapModule } from '../coin-market-cap/coin-market-cap.module';

@Module({
  imports: [CoinMarketCapModule, PrismaModule],
  controllers: [TokensController],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
