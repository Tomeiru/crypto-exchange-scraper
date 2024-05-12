import { Injectable } from '@nestjs/common';
import { Rate } from './interface/Rate';

@Injectable()
export abstract class RatesService {
  abstract addRateToToken(
    tokenId: string,
    exchangeRateUSD: number,
    evolutionRateLastHour: number,
  ): Promise<Rate>;

  abstract getAllRatesForToken(tokenId: string): Promise<Rate[]>;

  abstract getMostRecentRateForToken(
    tokenId: string,
  ): Promise<Rate | undefined>;

  abstract deleteAllRatesForToken(tokenId: string): Promise<void>;
}
