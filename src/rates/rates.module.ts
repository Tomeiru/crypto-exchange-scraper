import { Module } from '@nestjs/common';
import { RatesService } from './rates.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [PrismaModule, TokensModule],
  providers: [RatesService],
  exports: [RatesService],
})
export class RatesModule {}
