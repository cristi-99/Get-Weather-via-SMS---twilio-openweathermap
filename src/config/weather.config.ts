import { ConfigService } from "@nestjs/config";
import { validate, IsString, IsUrl, IsNotEmpty } from "class-validator";
import { HttpException, HttpStatus } from "@nestjs/common";

export class WeatherConfig{
    constructor (private readonly configService: ConfigService){
        this.configService = new ConfigService()
       this.weatherUrl = 'https://api.openweathermap.org/data/2.5/onecall';
        this.locationUrl = `https://api.opencagedata.com/geocode/v1/json`;
     
        this.weatherKey = this.configService.get('API_KEY_WEATHER');
        this.locationKey = this.configService.get('API_KEY_LOCATION')
        this.valid();
    };

    public async valid(){
        const errors = await validate(this); 
        if(errors.length> 0)
          throw new HttpException(errors, HttpStatus.NOT_ACCEPTABLE) 
      }

    @IsUrl()
    @IsNotEmpty()
    weatherUrl:string;
    
    @IsUrl()
    @IsNotEmpty()
    locationUrl:string;

    @IsString()
    @IsNotEmpty()
    weatherKey:string;

    @IsString()
    @IsNotEmpty()
    locationKey:string;


}
