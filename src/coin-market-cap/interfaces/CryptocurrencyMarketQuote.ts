interface APIQuote {
  price: number;
  percent_change_1h: number;
  percent_change_24h: number;
}

export interface CryptocurrenciesMarketQuote {
  data: {
    [key: string]: [
      {
        symbol: string;
        slug: string;
        name: string;
        quote: {
          USD: APIQuote;
        };
      },
    ];
  };
}
