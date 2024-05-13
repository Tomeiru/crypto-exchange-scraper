import { Injectable } from '@nestjs/common';
import { TokenMetadata } from './interfaces/TokenMetadata';
import { Token } from '../tokens/interface/Token';
import { TokenQuote } from './interfaces/TokenQuote';

@Injectable()
export abstract class CryptoDataProviderService {
  abstract getSymbolInformation(symbol: string): Promise<TokenMetadata>;

  abstract getCurrenciesLastMarketQuote(
    tokens: Token[],
  ): Promise<Map<Token, TokenQuote>>;
}
