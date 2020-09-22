
import { Weather } from "../weather.entity";

export class WeatherDto{

    totalCount:number;
    page:number;
    limit:number;
    data:Weather[]
}