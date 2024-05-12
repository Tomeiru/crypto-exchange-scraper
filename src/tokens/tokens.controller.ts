import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { AddTokenToTrackedDto } from './dto/add-token-to-tracked.dto';
import { TokensService } from './tokens.service';
import { Token } from './interface/Token';
import { CoinMarketCapService } from '../coin-market-cap/coin-market-cap.service';
import { DetailedTokenResponse } from './interface/DetailedTokenResponse';
import { TokenResponse } from './interface/TokenResponse';
import { TokenMetadata } from '../coin-market-cap/interfaces/TokenMetadata';
import { UnknownSymbolError } from '../coin-market-cap/coin-market-cap.errors';
import { RatesService } from '../rates/abstract.rates.service';

@Controller('tokens')
export class TokensController {
  constructor(
    private readonly tokenService: TokensService,
    private readonly coinMarketCapService: CoinMarketCapService,
    private readonly ratesService: RatesService,
  ) {}

  @Get()
  async findAll(): Promise<TokenResponse[]> {
    const tokens = await this.tokenService.getTokenList();
    return await Promise.all(
      tokens.map<Promise<TokenResponse>>(async (token) => {
        return {
          ...token,
          lastRate:
            (await this.ratesService.getMostRecentRateForToken(token.id)) ??
            null,
        };
      }),
    );
  }

  @Post()
  async addTokenToTracked(
    @Body() { symbol }: AddTokenToTrackedDto,
  ): Promise<Token> {
    const existingToken = await this.tokenService.getTokenFromSymbol(symbol);
    if (existingToken !== null) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          message: ['Token has already been registered'],
        },
        HttpStatus.CONFLICT,
      );
    }
    let tokenMetadata: TokenMetadata;
    try {
      tokenMetadata =
        await this.coinMarketCapService.getSymbolInformation(symbol);
    } catch (error) {
      if (error instanceof UnknownSymbolError) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            message: [`${symbol} does not match any Cryptocurrency`],
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw error;
    }
    return await this.tokenService.addTokenToList(
      tokenMetadata.symbol,
      tokenMetadata.slug,
      tokenMetadata.name,
    );
  }

  @Get(':symbol')
  async findOne(
    @Param('symbol') symbol: string,
  ): Promise<DetailedTokenResponse> {
    const token = await this.tokenService.getTokenFromSymbol(symbol);
    if (token === null) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: ['Token not found for symbol'],
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const rates = await this.ratesService.getAllRatesForToken(token.id);
    return {
      ...token,
      rates,
    };
  }

  @Delete(':symbol')
  @HttpCode(204)
  async delete(@Param('symbol') symbol: string): Promise<void> {
    const tokenToDelete = await this.tokenService.getTokenFromSymbol(symbol);
    if (tokenToDelete === null) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: [`Symbol ${symbol} doesn't match to any token`],
        },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.ratesService.deleteAllRatesForToken(tokenToDelete.id);
    await this.tokenService.removeTokenFromList(symbol);
  }
}
