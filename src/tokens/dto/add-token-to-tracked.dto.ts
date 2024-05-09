import { IsNotEmpty, NotContains } from 'class-validator';

export class AddTokenToTrackedDto {
  @IsNotEmpty()
  // "," can be used to chain different symbols in the subsequent API call which we want to avoid
  @NotContains(',')
  symbol: string;
}
