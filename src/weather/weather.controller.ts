import { Controller, Get, Req, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { query } from 'express';
import { QueryDto } from './dto/query.dto';

@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @Get('daily')
  getDailyWheater() {
    return this.weatherService.dailyWeather('Suceava', 'SMS');
  }

  @Get('source')
  getSourceQuery(@Query() query:QueryDto) {
      
    return this.weatherService.getBySource(
      query.source,
      query.howMany,
      query.page,
      query.start,
      query.end
    );
  }

  @Get('location')
  getLocationQuery(@Query() query:QueryDto){
      return this.weatherService.getByLocation(
          query.city,
          query.howMany,
          query.page,
          query.start,
          query.end
      )
  }
}
