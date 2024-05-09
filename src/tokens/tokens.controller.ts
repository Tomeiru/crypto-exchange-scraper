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

@Controller('tokens')
export class TokensController {
  constructor(
    private readonly tokenService: TokensService,
    private readonly coinMarketCapService: CoinMarketCapService,
  ) {}

  @Get()
  findAll(): string {
    return 'All Tokens';
  }

  // Possible improvement: take into account "slug" in order to accept different cryptos with same token.
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
  findOne(@Param('symbol') symbol: string): string {
    return `Find information about token with symbol ${symbol}`;
  }

  @Delete(':symbol')
  @HttpCode(204)
  async delete(@Param('symbol') symbol: string): Promise<void> {
    const deletedToken = await this.tokenService.removeTokenFromList(symbol);
    if (deletedToken === null) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: [`Symbol ${symbol} doesn't match to any token`],
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return;
  }
}
