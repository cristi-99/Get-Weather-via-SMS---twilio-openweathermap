import { Controller, Get, Req, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { query } from 'express';

@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @Get('daily')
  getDailyWheater() {
    return this.weatherService.dailyWeather('Suceava', 'SMS');
  }

  @Get('source')
  getSourceQuery(@Query() query) {
      
    return this.weatherService.getBySource(
      query.source,
      query.howMany,
      query.page,
      query.start,
      query.end
    );
  }

  @Get('location')
  getLocationQuery(@Query() query){
      return this.weatherService.getByLocation(
          query.city,
          query.howMany,
          query.page,
          query.start,
          query.end
      )
  }
}
