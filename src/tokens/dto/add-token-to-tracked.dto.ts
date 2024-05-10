import { IsNotEmpty } from 'class-validator';

export class AddTokenToTrackedDto {
  @IsNotEmpty()
  symbol: string;
}
