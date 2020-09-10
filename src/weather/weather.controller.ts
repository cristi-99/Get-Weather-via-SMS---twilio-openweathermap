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

  @Get('bySource')
  getSourceQuery(@Query() query: QueryDto) {
    return this.weatherService.getBySource(query);
  }

  @Get('byLocation')
  getLocationQuery(@Query() query: QueryDto) {
    return this.weatherService.getByLocation(query);
  }

  @Get('locations')
  getAllLocations() {
    return this.weatherService.getAllLocation();
  }

  @Get('registrations')
  getAllRegistrations() {
    return this.weatherService.getAllRegistrations();
  }
}
