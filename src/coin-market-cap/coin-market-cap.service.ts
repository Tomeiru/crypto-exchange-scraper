import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SymbolInformation } from './interfaces/SymbolInformation';
import { HttpService } from '@nestjs/axios';
import { CryptocurrenciesInformationBody } from './interfaces/CryptocurrencyInformationBody';

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
  async getSymbolInformation(
    symbol: string,
  ): Promise<SymbolInformation | null> {
    let information: SymbolInformation | null;
    try {
      const response =
        await this.httpService.axiosRef.get<CryptocurrenciesInformationBody>(
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
}
