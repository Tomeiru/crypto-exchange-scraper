import { Token } from './Token';
import { Rate } from '../../rates/interface/Rate';

export interface TokenResponse extends Token {
  lastRate: Rate | null;
}
