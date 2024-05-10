import { Token } from './Token';
import { Rate } from '../../rates/interface/Rate';

export interface DetailedTokenResponse extends Token {
  rates: Rate[];
}
