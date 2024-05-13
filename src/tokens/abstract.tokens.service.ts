import { Injectable } from '@nestjs/common';
import { Token } from './interface/Token';

@Injectable()
export abstract class TokensService {
  abstract addTokenToList(
    symbol: string,
    slug: string,
    name: string,
  ): Promise<Token>;

  abstract getTokenFromSymbol(symbol: string): Promise<Token | null>;

  abstract getTokenList(): Promise<Token[]>;

  abstract removeTokenFromList(symbol: string): Promise<void>;

  abstract removeAllTokens(): Promise<void>;
}
