import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenMetadata } from './interfaces/TokenMetadata';
import { HttpService } from '@nestjs/axios';
import { CryptocurrenciesMetadata } from './interfaces/CryptocurrenciesMetadata';
import { Token } from '../tokens/interface/Token';
import { CryptocurrenciesMarketQuote } from './interfaces/CryptocurrencyMarketQuote';
import { TokenQuote } from './interfaces/TokenQuote';

@Injectable()
export class CoinMarketCapService {
  private readonly API_KEY: string | null;
  private readonly API_HOSTNAME: string;

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    // TODO: Handle case where API Key has not been transmitted
    this.API_HOSTNAME = 'https://pro-api.coinmarketcap.com/v2/';
    this.API_KEY = this.configService.get('COIN_MARKET_CAP_API_KEY');
  }

  // TODO: null return replaced to error chaining
  // TODO: Replace axiosRef by Observable handling?
  async getSymbolInformation(symbol: string): Promise<TokenMetadata | null> {
    let information: TokenMetadata | null;
    try {
      const response =
        await this.httpService.axiosRef.get<CryptocurrenciesMetadata>(
          `${this.API_HOSTNAME}cryptocurrency/info`,
          {
            headers: {
              'X-CMC_PRO_API_KEY': this.API_KEY,
            },
            params: {
              symbol,
            },
          },
        );
      const matchingCryptos = response.data.data[symbol];
      information = {
        symbol: matchingCryptos[0].symbol,
        name: matchingCryptos[0].name,
        slug: matchingCryptos[0].slug,
      };
    } catch (error) {
      information = null;
    }
    return information;
  }

  // TODO: error chaining instead of returning base value
  async getCurrenciesLastMarketQuote(tokens: Token[]) {
    const quotes = new Map<Token, TokenQuote>();
    const symbols = tokens.map((token) => token.symbol);
    //const sludge = tokens.map((token) => token.sludge);
    try {
      const response =
        await this.httpService.axiosRef.get<CryptocurrenciesMarketQuote>(
          `${this.API_HOSTNAME}cryptocurrency/quotes/latest`,
          {
            headers: {
              'X-CMC_PRO_API_KEY': this.API_KEY,
            },
            params: {
              symbol: symbols.join(','),
            },
          },
        );
      for (const token of tokens) {
        const tokenData = response.data.data[token.symbol].find((apiToken) => {
          return apiToken.name === token.name && apiToken.slug === token.slug;
        });
        if (!tokenData) {
          continue;
        }
        const quote = tokenData.quote.USD;
        quotes.set(token, {
          price: quote.price,
          percent_change_1h: quote.percent_change_1h,
        });
      }
    } catch (error) {
      return quotes;
    }
    return quotes;
  }
}
