# Crypto Exchange Scraper: Installation, Start-up and environment

This README contains every information you need to set up and launch the Crypto Exchange Scraper for the first time. With Docker Compose for both production and development.

## Table of Contents

- [Table of contents](#table-of-contents)
- [Launch for development with Docker compose](#launch-for-development-with-docker-compose)
    - [Prerequisites](#prerequisites)
    - [Set up the environment](#set-up-the-environment)
    - [Build the containers](#build-the-containers)
    - [Migrate the database](#migrate-the-database)
    - [Start the project](#start-the-project)
    - [Run db:show to see the database content interactively](#run-dbshow-to-see-the-database-content-interactively)
- [Deploy with Docker compose](#deploy-with-docker-compose)
    - [Prerequisites](#prerequisites-1)
    - [Set up the environment](#set-up-the-environment-1)
    - [Build the containers](#build-the-containers-1)
    - [Start the project](#start-the-project-1)
- [Environment configuration](#environment-configuration)
- [Scraping](#scraping)
- [Flexibility](#flexibility)
- [Continuous Integration](#continuous-integration)
- [Testing](#testing)

## Launch for development with Docker compose

### Prerequisites

- [Docker 19.03.0+](https://docs.docker.com/get-docker/)
    - Despite this, some old version of docker compose might need you to use docker-compose instead of docker compose during the commands.

### Environment set-up

Follow the steps at [Environment configuration](#environment-configuration).

### Build the containers

Build your containers with:

```bash
docker compose build
```

### Migrate the database

Run the following command to initialize your database container according to your different Prisma schemas:

```bash
docker compose run -it --entrypoint npm api run db:migrate
```

### Start the project

You can now launch the project using:

```bash
docker compose up -d
```

### Run db:show to see the database content interactively

Once everything is set up, you can use the db:show script to see the database content interactively using:

```bash
docker compose run -p 5555:5555 -it --entrypoint npm api run db:show
```

Then you can access the database content on http://localhost:5555

⚠️ Be aware that your port environment should be different from 5555, otherwise you will have a port conflict. ⚠️

## Deploy with Docker compose

### Prerequisites

- [Docker 19.03.0+](https://docs.docker.com/get-docker/)
    - Despite this, some old version of docker compose might need you to use docker-compose instead of docker compose during the commands.

### Set up the environment

Follow the steps at [Environment configuration](#environment-configuration).

### Change Dockerfile target in docker-compose.yml

Change "Dockerfile" by "Dockerfile.prod" in the build section of the api service.

### Build the containers

Build your containers with:

```bash
docker compose build
```

### Start the project

You can now launch the project using (no manual migration is needed as starting the project will do so automatically):

```bash
docker compose up -d
```

## Environment configuration

Copy the .env.sample to .env, and replace/add the values you need according to the following table:

| Name                    | Description                                                                                                                                                                                                         | Type   |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|
| PORT                    | Port used and exposed by the Back-end application. ⚠️ It's recommended to avoid port 5555 as it is used by the db:show script and could result in a port conflict. ⚠️                                                 | number |
| POSTGRES_USER           | Username that will be used to access your database and compose the Database URL. Please note that this field is used on build to set up your database during first time launch.                                     | string |
| POSTGRES_PASSWORD       | Password that will be used to access your database and compose the Database URL. Please note that this field is used on build to set up your database during first time launch.                                     | string |
| POSTGRES_DB             | Database name that will be used to access your database and compose the Database URL. Please note that this field is used on build to set up your database during first time launch.                                | string |
| COIN_MARKET_CAP_API_KEY | API Key provided by the CoinMarketCap website needed for requesting Cryptocurrency information. You can generate this key by registering a free account here: [Coin Market Cap API](https://coinmarketcap.com/api/) | string |

## Scraping

Scraping is done under the form of a Cron job launched using the ScheduleModule provided by NestJS.

By default, the ScrapingService will launch the code listed under the scrape function of its class every minute. This will give the opportunity for the database to have the latest data about the cryptocurrency that have been registered.

In order to change the delay between each launch, the simple change of the Cron string above the function prototype will give you the opportunity to select the delay that fits the best with your environment.

## Flexibility

Four services and one controllers are vital for the project:
- The Rates Services (a type of service that will interact with the data source that persist our token's rates)
- The Tokens Services (a type of service that will interact with the data source that persist our token's list)
- The Crypto Data Provider Services (a type of service that will communicate with the data source that will bring our application new data)
- The Scraping Service (a service that will scrape our data using the services mentioned above)
- The Tokens Controller (a controller that will redistribute our data through the existence of different routes using the three first services mentioned above)

The Rates, Tokens and Crypto Data Provider Services are fully abstracted and put under interface in order to make the addition and replacement of data source really easy and convenient with the existence of the abstract.{service_name}.service.ts

The project contains by default, one implementation for each type of service:
- The Rates and Tokens services are implemented using Prisma with a PostgreSQL database.
- The Crypto Data Provider has an implementation using the CoinMarketCap service.

## Continuous Integration

The project contains a CI pipeline that will launch at each push on the main branch or new pull requests.

The CI pipeline will check:
- the Prettier formatting rules compliance
- the ESlint rules compliance
- if the project can build correctly
- if every unit tests pass
- if every integration tests pass

## Testing

Testing has been done under the form of Integration tests (end-to-end testing) that test all the routes exposed by the application under different circumstances using a real database.

Those tests can be run manually using this command (please note that this will erase the data contained in your database if you're using docker to develop):

```bash
docker compose run -it --entrypoint npm api run test:e2e
```

Those tests will also be run automatically using [Continuous Integration](#continuous-integration) as stated above.
