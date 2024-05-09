interface SymbolCryptoInformation {
  name: string;
  slug: string;
  symbol: string;
}

export interface CryptocurrenciesInformationBody {
  data: {
    [key: string]: SymbolCryptoInformation[];
  };
}
