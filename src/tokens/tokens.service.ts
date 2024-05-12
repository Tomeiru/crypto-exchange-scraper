import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Token } from './interface/Token';

@Injectable()
export class TokensService {
  constructor(private readonly prisma: PrismaService) {}

  async addTokenToList(
    symbol: string,
    slug: string,
    name: string,
  ): Promise<Token> {
    return this.prisma.token.create({
      data: {
        symbol: symbol,
        slug: slug,
        name: name,
      },
    });
  }

  async getTokenFromSymbol(symbol: string): Promise<Token | null> {
    return this.prisma.token.findUnique({
      where: {
        symbol: symbol,
      },
    });
  }

  async getTokenList(): Promise<Token[]> {
    return this.prisma.token.findMany();
  }

  async removeTokenFromList(symbol: string): Promise<void> {
    await this.prisma.token.delete({
      where: {
        symbol: symbol,
      },
    });
  }
}
