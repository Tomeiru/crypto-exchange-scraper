import { DynamicModule, Injectable } from '@nestjs/common';
import { TokenMetadata } from './interfaces/TokenMetadata';
import { HttpModule, HttpService } from '@nestjs/axios';
import { CryptocurrenciesMetadata } from './interfaces/CryptocurrenciesMetadata';
import { Token } from '../tokens/interface/Token';
import { CryptocurrenciesMarketQuote } from './interfaces/CryptocurrencyMarketQuote';
import { TokenQuote } from './interfaces/TokenQuote';
import axios from 'axios';
import { UnknownSymbolError } from './crypto-data-provider.errors';
import { CryptoDataProviderService } from './abstract.crypto-data-provider.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Injectable()
export class CoinMarketCapService extends CryptoDataProviderService {
  constructor(private readonly httpService: HttpService) {
    super();
  }

  async getSymbolInformation(symbol: string): Promise<TokenMetadata> {
    try {
      const response =
        await this.httpService.axiosRef.get<CryptocurrenciesMetadata>(
          `/cryptocurrency/info`,
          {
            params: {
              symbol,
            },
          },
        );
      const matchingCryptos = response.data.data[symbol];
      return {
        symbol: matchingCryptos[0].symbol,
        name: matchingCryptos[0].name,
        slug: matchingCryptos[0].slug,
      };
    } catch (error) {
      if (!axios.isAxiosError(error)) throw error;
      if (error.response.status === 400) {
        throw new UnknownSymbolError(
          `${symbol} has not been recognized by CoinMarketCap API`,
        );
      }
      throw error;
    }
  }

  async getCurrenciesLastMarketQuote(
    tokens: Token[],
  ): Promise<Map<Token, TokenQuote>> {
    const quotes = new Map<Token, TokenQuote>();
    const symbols = tokens.map((token) => token.symbol);
    const response =
      await this.httpService.axiosRef.get<CryptocurrenciesMarketQuote>(
        `/cryptocurrency/quotes/latest`,
        {
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
    return quotes;
  }

  static registerHTTPModule(): DynamicModule {
    return HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const apiKey = configService.get<string>('COIN_MARKET_CAP_API_KEY');
        if (!apiKey) {
          throw Error(
            "can't load CoinMarketCapModule as 'COIN_MARKET_CAP_API_KEY' hasn't been set.",
          );
        }
        return {
          baseURL: 'https://pro-api.coinmarketcap.com/v2/',
          headers: {
            'X-CMC_PRO_API_KEY': configService.get<string>(
              'COIN_MARKET_CAP_API_KEY',
            ),
          },
        };
      },
      inject: [ConfigService],
    });
  }
}
