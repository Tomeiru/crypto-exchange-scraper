import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TokensController } from './tokens/tokens.controller';
import { PrismaModule } from './prisma/prisma.module';
import { TokensModule } from './tokens/tokens.module';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { RatesModule } from './rates/rates.module';
import { ScrapingModule } from './scraping/scraping.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerMiddleware } from './logger.middleware';
import { CryptoDataProviderModule } from './crypto-data-provider/crypto-data-provider.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    TokensModule,
    HttpModule,
    RatesModule,
    ScrapingModule,
    ScheduleModule.forRoot(),
    CryptoDataProviderModule,
  ],
  controllers: [TokensController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
