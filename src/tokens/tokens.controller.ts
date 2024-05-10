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
import { RatesService } from '../rates/rates.service';
import { TokenResponse } from './interface/TokenResponse';

@Controller('tokens')
export class TokensController {
  constructor(
    private readonly tokenService: TokensService,
    private readonly coinMarketCapService: CoinMarketCapService,
    private readonly ratesService: RatesService,
  ) {}

  // TODO: error handling (500 if any DB request fails)
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
    const tokenInformation =
      await this.coinMarketCapService.getSymbolInformation(symbol);
    if (tokenInformation === null) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: ['Symbol does not match to any request'],
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const newToken = await this.tokenService.addTokenToList(
      tokenInformation.symbol,
      tokenInformation.slug,
      tokenInformation.name,
    );
    if (newToken === null) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: ['Could not register the new token for unknown reason'],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return newToken;
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
