import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class RatesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokens: TokensService,
  ) {}

  //TODO: Handle errors
  async addRateToTokens(
    symbol: string,
    exchangeRateUSD: number,
    evolutionRateLastHour: number,
  ) {
    const token = await this.tokens.getTokenFromSymbol(symbol);
    return this.prisma.rates.create({
      data: {
        tokenId: token.id,
        exchangeRateUSD: exchangeRateUSD,
        evolutionRateLastHour: evolutionRateLastHour,
      },
    });
  }
}
