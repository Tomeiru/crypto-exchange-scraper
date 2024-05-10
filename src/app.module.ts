import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokensController } from './tokens/tokens.controller';
import { PrismaModule } from './prisma/prisma.module';
import { TokensModule } from './tokens/tokens.module';
import { CoinMarketCapModule } from './coin-market-cap/coin-market-cap.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { RatesModule } from './rates/rates.module';

@Module({
  imports: [
    PrismaModule,
    CoinMarketCapModule,
    ConfigModule,
    TokensModule,
    HttpModule,
    RatesModule,
  ],
  controllers: [AppController, TokensController],
  providers: [AppService],
})
export class AppModule {}
