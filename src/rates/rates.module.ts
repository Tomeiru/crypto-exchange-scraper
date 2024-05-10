import { Module } from '@nestjs/common';
import { RatesService } from './rates.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RatesService],
  exports: [RatesService],
})
export class RatesModule {}
