import { Module } from '@nestjs/common';
import { TokensController } from './tokens.controller';
import { PrismaTokensService } from './prisma.tokens.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RatesModule } from '../rates/rates.module';
import { TokensService } from './abstract.tokens.service';
import { CryptoDataProviderModule } from '../crypto-data-provider/crypto-data-provider.module';

@Module({
  imports: [CryptoDataProviderModule, PrismaModule, RatesModule],
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
