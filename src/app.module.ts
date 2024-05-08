import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokensController } from './tokens/tokens.controller';

@Module({
  imports: [],
  controllers: [AppController, TokensController],
  providers: [AppService],
})
export class AppModule {}
