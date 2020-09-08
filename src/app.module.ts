import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TwilioModule } from './twilio/twilio.module';
import { TwilioService } from './twilio/twilio.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WeatherModule } from './weather/weather.module';
import { WebhookModule } from './webhook/webhook.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    TwilioModule,
    ConfigModule.forRoot(),
    HttpModule,
    WeatherModule,
    WebhookModule,
    CustomConfigModule,
    DatabaseModule,
    MongooseModule.forRoot(new ConfigService().get('DATABASE_PATH')),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
