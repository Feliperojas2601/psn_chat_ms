import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';

import { AppService } from './app.service';
import { ConfigurationService } from './configuration/configuration.service';

@Module({
  imports: [
    ChatModule,
    ConfigurationModule,
    MongooseModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: async (configurationService: ConfigurationService) =>
        configurationService.getMongoConfig(),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
