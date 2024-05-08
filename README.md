# crypto-exchange-scraper

A crypto exchange scraper with the objective of tracking the evolution of tokens exchange over time.

## TODO

- [x] Think about project structure
- [] Set up AWS Account ([Getting Started with AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html))
- [] Set up DynamoDB to keep Tracked Cryptocurrency and their respective historical data
- [] Set up Lambdas that will act as handlers when a request is received and send back the needed data
- [] Set up API Gateway to have the different routes up and running
- [] Set up Scraping Lambda that triggers on CloudWatch Events scheduler

## Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
