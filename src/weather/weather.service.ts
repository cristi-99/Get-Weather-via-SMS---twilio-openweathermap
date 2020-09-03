import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Location } from 'src/database/schemas/location.schema';
import { Model } from 'mongoose';
import { WeatherConfig } from './weather.config';
import { CreateLocationDto } from 'src/database/dto/createLocation.dto';
import { combineAll } from 'rxjs/operators';
import { response } from 'express';

@Injectable()
export class WeatherService {
  constructor(
    @InjectModel(Location.name) private locationModel: Model<Location>,
    private httpService: HttpService,
    private configService: ConfigService,
    private weatherConfig: WeatherConfig,
  ) {}

  async dailyWeather(city: string) {
    let locationKey = this.configService.get('API_KEY_LOCATION');
    let weatherKey = this.configService.get('API_KEY_WEATHER');
    let weatherUrl = this.weatherConfig.weatherUrl;
    let locationUrl =
      this.weatherConfig.locationUrl + `?key=${locationKey}&q=${city}`;
    let locationInDB;
    locationInDB = await this.locationModel.findOne({address:city});
    
    let lat, lng;
    if (locationInDB !== null) {
      lat = locationInDB.lat;
      lng = locationInDB.lng;
    } else {
      let laltong;
      await this.httpService
        .get(locationUrl)
        .toPromise()
        .then(res => {
          laltong = res.data;
        })
        .catch(err => err);
      lat = laltong['results'][0].bounds.northeast.lat;
      lng = laltong['results'][0].bounds.northeast.lng;
      const locationToDB = new this.locationModel({
        address: city,
        lat: lat,
        lng: lng,
      });
      locationToDB.save((err: any) => {
        if (err) return console.error(err);
      });
    }

    return this.httpService
      .get(
        weatherUrl +
          `?lat=${lat}&lon=${lng}&exclude=hourly,minutely` +
          `&appid=${weatherKey}`,
      )
      .toPromise()
      .then(res => res.data.daily)
      .catch(err => {
        return err;
      });
  }
}
