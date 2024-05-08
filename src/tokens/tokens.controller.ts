import { Controller, Delete, Get, Param, Post } from '@nestjs/common';

@Controller('tokens')
export class TokensController {
  @Get()
  findAll(): string {
    return 'All Tokens';
  }

  @Post()
  addToList(): string {
    return 'Add Symbol to List';
  }

  @Get(':symbol')
  findOne(@Param('symbol') symbol: string): string {
    return `Find information about token with symbol ${symbol}`;
  }

  @Delete(':symbol')
  delete(@Param('symbol') symbol: string): string {
    return `Delete ${symbol} from the list`;
  }
}
