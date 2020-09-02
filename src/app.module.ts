import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TwilioModule } from './twilio/twilio.module';
import { TwilioService } from './twilio/twilio.service';
import { ConfigModule } from '@nestjs/config';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [TwilioModule, ConfigModule.forRoot(), HttpModule, WeatherModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
