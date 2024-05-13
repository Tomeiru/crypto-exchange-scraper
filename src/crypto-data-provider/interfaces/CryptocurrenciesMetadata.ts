interface APISymbolMetadata {
  name: string;
  symbol: string;
  slug: string;
  description: string;
}

export interface CryptocurrenciesMetadata {
  data: {
    [key: string]: APISymbolMetadata[];
  };
}
