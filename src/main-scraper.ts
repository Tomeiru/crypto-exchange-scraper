import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CoinMarketCapModule } from './coin-market-cap/coin-market-cap.module';
import { CoinMarketCapService } from './coin-market-cap/coin-market-cap.service';
import { TokensService } from './tokens/tokens.service';
import { TokensModule } from './tokens/tokens.module';
import { RatesService } from './rates/rates.service';
import { RatesModule } from './rates/rates.module';

//TODO: create a Scraper Module that have a scraper service that imports services that we are currently calling.
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  let CMCService: CoinMarketCapService = null;
  let tokenService: TokensService = null;
  let ratesService: RatesService = null;
  try {
    CMCService = app.select(CoinMarketCapModule).get(CoinMarketCapService);
    tokenService = app.select(TokensModule).get(TokensService);
    ratesService = app.select(RatesModule).get(RatesService);
  } catch (error) {
    console.error(error);
    await app.close();
    return process.exit(1);
  }
  const tokens = await tokenService.getTokenList();
  const quotes = await CMCService.getCurrenciesLastMarketQuote(tokens);
  const rates = [];
  for (const [token, quote] of quotes) {
    rates.push(
      await ratesService.addRateToToken(
        token.symbol,
        quote.price,
        quote.percent_change_1h,
      ),
    );
  }
  console.log(rates);
}
bootstrap();
