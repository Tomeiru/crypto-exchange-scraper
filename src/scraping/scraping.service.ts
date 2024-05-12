import { Injectable, Logger } from '@nestjs/common';
import { TokensService } from '../tokens/tokens.service';
import { CoinMarketCapService } from '../coin-market-cap/coin-market-cap.service';
import { RatesService } from '../rates/rates.service';
import { Cron } from '@nestjs/schedule';
import { Token } from '../tokens/interface/Token';
import { TokenQuote } from '../coin-market-cap/interfaces/TokenQuote';

@Injectable()
export class ScrapingService {
  private readonly logger = new Logger(ScrapingService.name);
  constructor(
    private readonly tokenService: TokensService,
    private readonly coinMarketCapService: CoinMarketCapService,
    private readonly ratesService: RatesService,
  ) {}

  //TODO: batch creation instead of single creation (createMany vs create)?
  @Cron('0 * * * * *')
  async scrape() {
    this.logger.log('Scraping started');
    let tokens: Token[] = [];
    let quotes = new Map<Token, TokenQuote>();
    try {
      tokens = await this.tokenService.getTokenList();
      quotes =
        await this.coinMarketCapService.getCurrenciesLastMarketQuote(tokens);
    } catch (error) {
      this.logger.error(
        `Scraping failed: could not get token list or last market quotes`,
        error.toString(),
      );
      return;
    }
    let newAdditions = 0;
    for (const [token, quote] of quotes) {
      try {
        await this.ratesService.addRateToToken(
          token.id,
          quote.price,
          quote.percent_change_1h,
        );
        newAdditions += 1;
      } catch (error) {
        this.logger.warn(
          `${token.name}: could not add latest rate to the database`,
          error.toString(),
        );
      }
    }
    this.logger.log(
      `Scraping completed: ${newAdditions} new rates have been added`,
    );
  }
}