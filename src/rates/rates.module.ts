import { Module } from '@nestjs/common';
import { PrismaRatesService } from './prisma.rates.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RatesService } from './abstract.rates.service';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: RatesService,
      useClass: PrismaRatesService,
    },
  ],
  exports: [RatesService],
})
export class RatesModule {}
