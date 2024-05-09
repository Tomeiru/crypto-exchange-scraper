import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CoinMarketCapService } from './coin-market-cap/coin-market-cap.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly coinMarketCapService: CoinMarketCapService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
