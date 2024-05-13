import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Rate } from './interface/Rate';
import { RatesService } from './abstract.rates.service';

@Injectable()
export class PrismaRatesService extends RatesService {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async addRateToToken(
    tokenId: string,
    exchangeRateUSD: number,
    evolutionRateLastHour: number,
  ): Promise<Rate> {
    return this.prisma.rates.create({
      data: {
        tokenId: tokenId,
        exchangeRateUSD: exchangeRateUSD,
        evolutionRateLastHour: evolutionRateLastHour,
      },
    });
  }

  async getAllRatesForToken(tokenId: string): Promise<Rate[]> {
    return this.prisma.rates.findMany({
      where: {
        tokenId: tokenId,
      },
      orderBy: {
        recordedTime: 'desc',
      },
    });
  }

  async getMostRecentRateForToken(tokenId: string): Promise<Rate | undefined> {
    return this.prisma.rates.findFirst({
      where: {
        tokenId: tokenId,
      },
      orderBy: {
        recordedTime: 'desc',
      },
    });
  }

  async deleteAllRatesForToken(tokenId: string): Promise<void> {
    await this.prisma.rates.deleteMany({
      where: {
        tokenId: tokenId,
      },
    });
  }

  async deleteAllRates(): Promise<void> {
    await this.prisma.rates.deleteMany();
  }
}
