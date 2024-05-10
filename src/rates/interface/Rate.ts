export interface Rate {
  id: number;
  recordedTime: Date;
  exchangeRateUSD: number;
  evolutionRateLastHour: number;
  tokenId: string;
}
