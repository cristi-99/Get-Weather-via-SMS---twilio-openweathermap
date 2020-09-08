import { Module, HttpModule } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './location.entity';
import { Weather } from './weather.entity';
import { CustomConfigModule } from 'src/config/config.module';
import { Source } from './source.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Location]),
    TypeOrmModule.forFeature([Weather]),
    TypeOrmModule.forFeature([Source]),
    CustomConfigModule,
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [WeatherController],
  providers: [WeatherService],
  exports: [WeatherService],
})
export class WeatherModule {}
