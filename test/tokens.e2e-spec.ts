import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TokensModule } from '../src/tokens/tokens.module';
import { TokensService } from '../src/tokens/abstract.tokens.service';
import { RatesModule } from '../src/rates/rates.module';
import { RatesService } from '../src/rates/abstract.rates.service';
import { ScrapingService } from '../src/scraping/scraping.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('TokensController (e2e)', () => {
  let app: INestApplication;
  const scrapingService = { scrape: () => {} };

  async function clearDatabase() {
    await app.select(RatesModule).get(RatesService).deleteAllRates();
    await app.select(TokensModule).get(TokensService).removeAllTokens();
  }

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ScrapingService)
      .useValue(scrapingService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.select(PrismaModule).get(PrismaService).$disconnect();
  });

  describe('/tokens (POST)', () => {
    beforeEach(clearDatabase);

    it('should respond with a newly created token', async () => {
      const response = await request(app.getHttpServer())
        .post('/tokens')
        .send({ symbol: 'ETH' })
        .expect(201);
      expect(response.body.id).toBeDefined();
      expect(response.body.symbol).toStrictEqual('ETH');
      expect(response.body.slug).toBeDefined();
      expect(response.body.name).toBeDefined();
    });

    it('should respond with 409 when requesting the creation of an already existing token', async () => {
      const tokenService = app.select(TokensModule).get(TokensService);
      await tokenService.addTokenToList('ETH', 'ethereum', 'Ethereum');
      const response = await request(app.getHttpServer())
        .post('/tokens')
        .send({ symbol: 'ETH' })
        .expect(409);
      expect(response.body.status).toStrictEqual(409);
      expect(response.body.message).toEqual([
        'Token has already been registered',
      ]);
    });

    it('should respond with 400 when requesting a non-existent token', async () => {
      const response = await request(app.getHttpServer())
        .post('/tokens')
        .send({ symbol: 'A symbol that will never exists' })
        .expect(400);
      expect(response.body.status).toStrictEqual(400);
      expect(response.body.message).toEqual([
        'A symbol that will never exists does not match any Cryptocurrency',
      ]);
    });
  });

  describe('/tokens/:id (DELETE)', () => {
    beforeEach(clearDatabase);

    it('should respond with 204 when deleting a token', async () => {
      const tokenService = app.select(TokensModule).get(TokensService);
      await tokenService.addTokenToList('ETH', 'ethereum', 'Ethereum');
      await request(app.getHttpServer()).delete('/tokens/ETH').expect(204);
    });

    it('should respond with 204 when deleting a token with rates', async () => {
      const tokenService = app.select(TokensModule).get(TokensService);
      const ratesService = app.select(RatesModule).get(RatesService);
      const token = await tokenService.addTokenToList(
        'ETH',
        'ethereum',
        'Ethereum',
      );
      await ratesService.addRateToToken(token.id, 2, 2);
      await request(app.getHttpServer()).delete('/tokens/ETH').expect(204);
    });

    it('should respond 404 when trying to delete a non existent token', async () => {
      const response = await request(app.getHttpServer())
        .delete('/tokens/ETH')
        .expect(404);
      expect(response.body.status).toStrictEqual(404);
      expect(response.body.message).toEqual([
        "Symbol ETH doesn't match to any token",
      ]);
    });
  });

  describe('/tokens (GET)', () => {
    beforeEach(clearDatabase);

    it('should return an empty list when there are no tokens', async () => {
      const response = await request(app.getHttpServer())
        .get('/tokens')
        .expect(200);
      expect(response.body).toEqual([]);
    });

    it('should return a list of containing existing tokens', async () => {
      const tokenService = app.select(TokensModule).get(TokensService);
      await tokenService.addTokenToList('ETH', 'ethereum', 'Ethereum');
      await tokenService.addTokenToList('BTC', 'bitcoin', 'Bitcoin');

      const response = await request(app.getHttpServer())
        .get('/tokens')
        .expect(200);
      expect(response.body.length).toStrictEqual(2);
    });

    it('should provides the lastRate of the token in the list', async () => {
      const tokenService = app.select(TokensModule).get(TokensService);
      const ratesService = app.select(RatesModule).get(RatesService);
      const ethereum = await tokenService.addTokenToList(
        'ETH',
        'ethereum',
        'Ethereum',
      );
      await ratesService.addRateToToken(ethereum.id, 2, 2);
      const lastRateForEthereum = await ratesService.addRateToToken(
        ethereum.id,
        2,
        2,
      );

      const response = await request(app.getHttpServer())
        .get('/tokens')
        .expect(200);
      expect(response.body.length).toStrictEqual(1);
      expect(response.body[0].id).toStrictEqual(ethereum.id);
      expect(response.body[0].lastRate.id).toEqual(lastRateForEthereum.id);
    });
    it('should return a null lastRate if a token has no rate', async () => {
      const tokenService = app.select(TokensModule).get(TokensService);
      const bitcoin = await tokenService.addTokenToList(
        'BTC',
        'bitcoin',
        'Bitcoin',
      );

      const response = await request(app.getHttpServer())
        .get('/tokens')
        .expect(200);
      expect(response.body.length).toStrictEqual(1);
      expect(response.body[0].id).toStrictEqual(bitcoin.id);
      expect(response.body[0].lastRate).toStrictEqual(null);
    });
  });

  describe('/tokens/:id (GET)', () => {
    beforeEach(clearDatabase);

    it('should respond with the token when getting a token and an empty list of rates if it has no rate', async () => {
      const tokenService = app.select(TokensModule).get(TokensService);
      const token = await tokenService.addTokenToList(
        'ETH',
        'ethereum',
        'Ethereum',
      );
      const response = await request(app.getHttpServer())
        .get('/tokens/ETH')
        .expect(200);
      expect(response.body.id).toStrictEqual(token.id);
      expect(response.body.rates).toEqual([]);
    });

    it('should respond with the token when getting a token and a list of its rate ordered from most recent to oldest', async () => {
      const tokenService = app.select(TokensModule).get(TokensService);
      const ratesService = app.select(RatesModule).get(RatesService);
      const token = await tokenService.addTokenToList(
        'ETH',
        'ethereum',
        'Ethereum',
      );
      const oldRate = await ratesService.addRateToToken(token.id, 2, 2);
      const newRate = await ratesService.addRateToToken(token.id, 2, 2);
      const response = await request(app.getHttpServer())
        .get('/tokens/ETH')
        .expect(200);
      expect(response.body.id).toStrictEqual(token.id);
      expect(response.body.rates.length).toStrictEqual(2);
      expect(response.body.rates[0].id).toStrictEqual(newRate.id);
      expect(response.body.rates[1].id).toStrictEqual(oldRate.id);
    });

    it('should respond 404 when trying to get a non existent token', async () => {
      const response = await request(app.getHttpServer())
        .get('/tokens/ETH')
        .expect(404);
      expect(response.body.status).toStrictEqual(404);
      expect(response.body.message).toEqual([
        "Symbol ETH doesn't match to any token",
      ]);
    });
  });
});
