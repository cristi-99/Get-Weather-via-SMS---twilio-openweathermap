import { ConfigService, ConfigModule } from '@nestjs/config';
import { IsString, IsNotEmpty, IsNumber, validate } from 'class-validator';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';


@Injectable()
export class DatabaseConfig{
  
  constructor(config: ConfigService) {
    this.JWT_SECRET = config.get('JWT_SECRET');
    this.JWT_EXPIRATION_TIME = config.get('JWT_EXPIRATION_TIME');
    this.POSTGRES_HOST = config.get('POSTGRES_HOST');
    this.POSTGRES_PORT = parseInt( config.get('POSTGRES_PORT'));
    this.POSTGRES_USER = config.get('POSTGRES_USER');
    this.POSTGRES_PASSWORD = config.get('POSTGRES_PASSWORD');
    this.POSTGRES_DB = config.get('POSTGRES_DB');
    this.valid();
    
  }



  public async valid(){
    const errors = await validate(this); 
    if(errors.length> 0)
      throw new HttpException(errors, HttpStatus.NOT_ACCEPTABLE) 
  }
  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;
  @IsString()
  @IsNotEmpty()
  JWT_EXPIRATION_TIME: string;
  @IsString()
  @IsNotEmpty()
  POSTGRES_HOST: string;
  @IsNumber()
  @IsNotEmpty()
  POSTGRES_PORT: number;
  @IsString()
  @IsNotEmpty()
  POSTGRES_USER: string;
  @IsString()
  @IsNotEmpty()
  POSTGRES_PASSWORD: string;
  @IsString()
  @IsNotEmpty()
  POSTGRES_DB: string;
}
