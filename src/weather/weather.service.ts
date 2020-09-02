import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WeatherService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async dailyWeather(city: string) {
    let locationKey = this.configService.get('API_KEY_LOCATION');
    let weatherKey = this.configService.get('API_KEY_WEATHER');
    let weatherUrl = 'https://api.openweathermap.org/data/2.5/onecall';
    let locationUrl = `https://api.opencagedata.com/geocode/v1/json?key=${locationKey}&q=${city}`;
    
    let laltong;
    await this.httpService
      .get(locationUrl)
      .toPromise()
      .then(res => {
        laltong = res.data;
      })
      .catch(err => err);
    let lat = laltong['results'][0].bounds.northeast.lat;
    let lng = laltong['results'][0].bounds.northeast.lng;
    
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
