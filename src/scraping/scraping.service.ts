import { Injectable } from '@nestjs/common';
import { TokensService } from '../tokens/tokens.service';
import { CoinMarketCapService } from '../coin-market-cap/coin-market-cap.service';
import { RatesService } from '../rates/rates.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ScrapingService {
  constructor(
    private readonly tokenService: TokensService,
    private readonly coinMarketCapService: CoinMarketCapService,
    private readonly ratesService: RatesService,
  ) {}

  @Cron('0 * * * * *')
  async scrape() {
    const tokens = await this.tokenService.getTokenList();
    const quotes =
      await this.coinMarketCapService.getCurrenciesLastMarketQuote(tokens);
    const rates = [];
    for (const [token, quote] of quotes) {
      rates.push(
        await this.ratesService.addRateToToken(
          token.id,
          quote.price,
          quote.percent_change_1h,
        ),
      );
    }
    console.log(rates);
  }
}
