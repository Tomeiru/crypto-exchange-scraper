import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb  from "aws-cdk-lib/aws-dynamodb";
import * as lambda  from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway"

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


      // Those are test handler to test the link between APIGW and Lambdas
      // TODO: Create proper handlers for each endpoint
      const createHandler = new lambda.Function(this, "CreateHandler", {
          code: lambda.Code.fromAsset('handlers/tokens'),
          runtime: lambda.Runtime.PYTHON_3_12,
          handler: 'create.handler',
      })
      const deleteHandler = new lambda.Function(this, "DeleteHandler", {
          code: lambda.Code.fromAsset('handlers/tokens'),
          runtime: lambda.Runtime.PYTHON_3_12,
          handler: 'delete.handler',
      })
      const getAllTokensHandler = new lambda.Function(this, "GetAllTokensHandler", {
          code: lambda.Code.fromAsset('handlers/tokens'),
          runtime: lambda.Runtime.PYTHON_3_12,
          handler: 'get_all.handler',
      })
      const getOneTokenHandler = new lambda.Function(this, "GetOneTokenHandler", {
          code: lambda.Code.fromAsset('handlers/tokens'),
          runtime: lambda.Runtime.PYTHON_3_12,
          handler: 'get_one.handler',
      })

      const api = new apigw.RestApi(this, 'imageAPI');

      const tokens = api.root.addResource('tokens');
      tokens.addMethod("GET", new apigw.LambdaIntegration(getAllTokensHandler))
      tokens.addMethod("POST", new apigw.LambdaIntegration(createHandler))

      const singleToken = tokens.addResource('{token}');
      singleToken.addMethod('GET', new apigw.LambdaIntegration(getOneTokenHandler))
      singleToken.addMethod('DELETE', new apigw.LambdaIntegration(deleteHandler));
  }
}
