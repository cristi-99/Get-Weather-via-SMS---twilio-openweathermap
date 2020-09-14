import {
  Injectable,
  HttpService,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Location } from './location.entity';
import { WeatherConfig } from '../config/weather.config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Weather } from './weather.entity';
import { Source } from './source.entity';
import { QueryDto } from './dto/query.dto';
import { WeatherDto } from './dto/weather.dto';


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

  async getLocation(city: string) : Promise<Location> {
    city = city.toLowerCase();
    let locationKey: string = this.weatherConfig.locationKey;
    let locationUrl: string =
      this.weatherConfig.locationUrl + `?key=${locationKey}&q=${city}`;
    let locationInDB: Location = await this.locationRepostitory.findOne({
      city,
    });
    let notFound: boolean = false;
    let lat: string, lng: string;
    if (locationInDB) {
      return locationInDB;
    } else {
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
      if (notFound)
        throw new HttpException('Incorrect city', HttpStatus.BAD_REQUEST);
      lat = locationInDB['results'][0].bounds.northeast.lat;
      lng = locationInDB['results'][0].bounds.northeast.lng;
      const newLocation: Location = this.locationRepostitory.create({
        latitude: lat,
        longitude: lng,
        city: city,
      });
      await this.locationRepostitory.save(newLocation);
      return newLocation;
    }
  }

  async dailyWeather(city: string, source: string) {
    let weatherKey:string = this.weatherConfig.weatherKey;
    let weatherUrl:string = this.weatherConfig.weatherUrl;

    const locationInDB: Location = await this.getLocation(city);

    const lat: string = locationInDB.latitude;
    const lng: string = locationInDB.longitude;

    let today: Date = new Date();
    let dd: number = today.getDate();
    let mm: number = today.getMonth() + 1;
    let yyyy: number = today.getFullYear();
    let date: string = yyyy + '-' + mm + '-' + dd;

    const sourceId: Source = await this.sourceRepository.findOne({
      source: source,
    });
    const findWeather: Weather = await this.weatherRepository.findOne({
      city: locationInDB,
      date: date,
    });

    return this.httpService
      .get(
        weatherUrl +
          `?lat=${lat}&lon=${lng}&exclude=hourly,minutely` +
          `&appid=${weatherKey}`,
      )
      .toPromise()
      .then(res => {
        if (findWeather) return res.data.daily;
        const newWeather: Weather = this.weatherRepository.create({
          temperature: Math.floor(
            parseInt(res.data.daily[0].temp.day) - 275.15,
          ),
          condition: res.data.daily[0].weather[0].description,
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

  async getBySource(params: QueryDto): Promise<WeatherDto> {
    if (!params.source)
      throw new HttpException('Provide source', HttpStatus.BAD_REQUEST);

    let src:Source = await this.getSource(params.source);
    let id:number;
    if (src) id = src.id;
    else throw new HttpException('Incorrect source', HttpStatus.BAD_REQUEST);

    const page:number = parseInt(params.page);
    const howMany:number = parseInt(params.howMany);

    let query = this.weatherRepository
      .createQueryBuilder()
      .where('Weather.source = :source', { source: id });
      console.log(typeof query)
    if (params.start && params.end) {
      query = query
        .andWhere('Weather.date >= :start', { start: params.start })
        .andWhere('Weather.date <= :end', { end: params.end });
    }

    const totalCount = await query.getCount();

    if (page && howMany)
      query = query.limit(howMany).offset((page - 1) * howMany);

    const datas = await query.getMany();
    return {
      totalCount,
      page: page,
      limit: howMany,
      data: datas,
    };
  }

  async getSource(source: string): Promise<Source> {
    return this.sourceRepository.findOne({ source });
  }

  async getByLocation(params: QueryDto): Promise<WeatherDto> {
    params.city = params.city.toLowerCase();
    let loc: Location = await this.locationRepostitory.findOne({
      city: params.city,
    });
    let id: number;
    if (loc) id = loc.id;
    else throw new HttpException('Incorrect city', HttpStatus.BAD_REQUEST);
    let query = this.weatherRepository
      .createQueryBuilder()
      .where('Weather.city = :location', { location: id });
    if (params.start && params.end) {
      query = query
        .andWhere('Weather.date >= :start', { start: params.start })
        .andWhere('Weather.date <= :end', { end: params.end });
    }

    const totalCount: number = await query.getCount();

    const page = parseInt(params.page);
    const howMany = parseInt(params.howMany);

    if (page) query = query.limit(howMany).offset((page - 1) * howMany);

    const datas = await query.getMany();
    return {
      totalCount,
      page: page,
      limit: howMany,
      data: datas,
    };
  }

  async getAllLocation(): Promise<Location[]> {
    let locations: Location[] = await this.locationRepostitory.find({});
    return locations;
  }

  async getAllRegistrations(): Promise<Weather[]> {
    let weather: Weather[] = await this.weatherRepository.find({
      relations: ['city', 'source'],
    });
    return weather;
  }

  async getMaxWeatherLocation(city: string): Promise<Weather>{
    const location: Location = await this.locationRepostitory.findOne({city:city});
    const weather: Weather = await this.weatherRepository.createQueryBuilder()
    .select('MAX(Weather.temperature)')
    .select(['Weather.date', 'Weather.temperature'])
    .where('Weather.city = :city', {city:location.id})
    .getOne();
    return weather;

  }

  async getMaxTemperature() : Promise<Weather[]>{
    const tempMax:Weather = await this.weatherRepository.createQueryBuilder()
    .select('MAX(Weather.temperature)', 'temperature')
    .getRawOne();
    const weather:Weather[] = await this.weatherRepository.createQueryBuilder()
    .select('Weather')
    .innerJoinAndSelect('Weather.city','city')
    .where('Weather.temperature = :temperature', {temperature: tempMax.temperature})
    
    .getMany();
    return weather;

  }
}
