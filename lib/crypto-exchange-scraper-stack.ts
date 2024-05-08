import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb  from "aws-cdk-lib/aws-dynamodb";

export class CryptoExchangeScraperStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

      const trackedCurrenciesTable = new dynamodb.Table(
        this, "TrackedCryptoCurrencies", {
            partitionKey: { name: "symbol", type: dynamodb.AttributeType.STRING },
        }
      )
      new cdk.CfnOutput(this, 'TrackedCurrenciesDatabaseTable', { value: trackedCurrenciesTable.tableName });

      const currenciesDataTable = new dynamodb.Table(
        this, "CryptoCurrenciesData", {
          partitionKey: { name: "symbol", type: dynamodb.AttributeType.STRING },
          sortKey: { name: "datetime", type:dynamodb.AttributeType.STRING}
        }
      )
      new cdk.CfnOutput(this, 'CryptoCurrenciesDataDatabaseTable', { value: currenciesDataTable.tableName });
  }
}
