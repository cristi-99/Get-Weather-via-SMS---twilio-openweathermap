import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Location } from './location.entity';
import { Model } from 'mongoose';
import { WeatherConfig } from '../config/weather.config';
import { InjectRepository } from '@nestjs/typeorm';
import {
  In,
  Repository,
  createQueryBuilder,
  getRepository,
  Between,
} from 'typeorm';
import { Weather } from './weather.entity';
import { Source } from './source.entity';
import { hostname } from 'os';

@Injectable()
export class WeatherService {
  constructor(
    @InjectRepository(Location)
    private locationRepostitory: Repository<Location>,
    @InjectRepository(Weather) private weatherRepository: Repository<Weather>,
    @InjectRepository(Source) private sourceRepository: Repository<Source>,
    private httpService: HttpService,
    private weatherConfig: WeatherConfig,
  ) {}

  async dailyWeather(city: string, source: string) {
    let locationKey = this.weatherConfig.locationKey;
    let weatherKey = this.weatherConfig.weatherKey;
    let weatherUrl = this.weatherConfig.weatherUrl;
    let locationUrl =
      this.weatherConfig.locationUrl + `?key=${locationKey}&q=${city}`;
    let locationInDB;
    locationInDB = await this.locationRepostitory.findOne({ city });
    let notFound = false;
    let lat: string, lng: string;
    if (locationInDB) {
      lat = locationInDB.latitude;
      lng = locationInDB.longitude;
    } else {
      let laltong;
      await this.httpService
        .get(locationUrl)
        .toPromise()
        .then(res => {
          if (res.data['results'].length === 0) {
            notFound = true;
            return 'Incorrect city';
          }

          locationInDB = res.data;
        })
        .catch(err => {
          return 'Incorrect city';
        });
      if (notFound) return 'Incorrect city';
      lat = locationInDB['results'][0].bounds.northeast.lat;
      lng = locationInDB['results'][0].bounds.northeast.lng;
      const newLocation = this.locationRepostitory.create({
        latitude: lat,
        longitude: lng,
        city: city,
      });
      await this.locationRepostitory.save(newLocation);
      locationInDB = newLocation;
    }

    var date = new Date();

    const sourceId = await this.sourceRepository.findOne({ source: source });
    // const findWeather = await this.weatherRepository.findOne({
    //   city: locationInDB,
    //   date: date,
    //  });

    return this.httpService
      .get(
        weatherUrl +
          `?lat=${lat}&lon=${lng}&exclude=hourly,minutely` +
          `&appid=${weatherKey}`,
      )
      .toPromise()
      .then(res => {
        //if (findWeather) return res.data.daily;
        const newWeather = this.weatherRepository.create({
          temperature: Math.floor(
            parseInt(res.data.daily[0].temp.day) - 275.15,
          ),
          condition: res.data.daily[0].weather[0].description,
          // date: date,
          city: locationInDB,
          source: sourceId,
        });
        this.weatherRepository.save(newWeather);

        return res.data.daily;
      })
      .catch(err => {
        return err;
      });
  }

  async getBySource(source, howMany, page, start, end) {
    let src = await this.getSource(source);
    let id;
    if (src) id = src.id;
    else return 'No entry';

    let query = this.weatherRepository.createQueryBuilder();

    if (page)
      query = query.andWhere('Weather.source = :source', { source: id });
    if (start && end) {
      query = query
        .andWhere('Weather.date >= :start', { start: start })
        .andWhere('Weather.date <= :end', { end: end });
    }

    const totalCount = await query.getCount();

    if (page) query = query.limit(howMany).offset((page - 1) * howMany);

    const datas = await query.getMany();
    return {
      totalCount,
      page: page,
      limit: howMany,
      data: datas,
    };
  }

  async getSource(source) {
    return this.sourceRepository.findOne({ source });
  }

  async getByLocation(city,howMany, page, start, end) {
    let loc = await this.locationRepostitory.findOne({city})
    let id;
    if(loc)
      id = loc.id;
    else
      return "Incorrect city";
    let query = this.weatherRepository.createQueryBuilder()
    if (page)
      query = query.andWhere('Weather.city = :location', { location: id });
    if (start && end) {
      query = query
        .andWhere('Weather.date >= :start', { start: start })
        .andWhere('Weather.date <= :end', { end: end });
    }

    const totalCount = await query.getCount();

    if (page) query = query.limit(howMany).offset((page - 1) * howMany);

    const datas = await query.getMany();
    return {
      totalCount,
      page: page,
      limit: howMany,
      data: datas,
    };
  }
}
