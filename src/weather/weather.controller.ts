import { Controller, Get, Req, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { query } from 'express';
import { QueryDto } from './dto/query.dto';

@Controller('weather')
export class WeatherController {
  constructor(private weatherService: WeatherService) {}

  @Get('daily')
  getDailyWheater(@Query() query) {
    return this.weatherService.dailyWeather(query.city, 'SMS');
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

  @Get('max')
  getMaxTemperatureLocation(){
    return this.weatherService.getMaxWeatherLocation('suceava');
  }

  @Get('temperatures')
  getMaxTemperature(){
    return this.weatherService.getMaxTemperature()
  }
}
