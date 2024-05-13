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


