import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Token } from './interface/Token';

//TODO: Change TokensService from returning null to chaining Error for controller to handle
@Injectable()
export class TokensService {
  constructor(private readonly prisma: PrismaService) {}

  async addTokenToList(
    symbol: string,
    slug: string,
    name: string,
  ): Promise<Token | null> {
    let token: Token | null = null;
    try {
      token = await this.prisma.token.create({
        data: {
          symbol: symbol,
          slug: slug,
          name: name,
        },
      });
    } catch (e) {
      return null;
    }
    return token;
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

  async removeTokenFromList(symbol: string) {
    let deletedToken: Token | null = null;
    try {
      deletedToken = await this.prisma.token.delete({
        where: {
          symbol: symbol,
        },
      });
    } catch (e) {
      return null;
    }
    return deletedToken;
  }
}
