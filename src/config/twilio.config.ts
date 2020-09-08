import { ConfigService } from "@nestjs/config";
import { validate, IsNotEmpty, IsString, IsPhoneNumber } from "class-validator";
import { HttpException, HttpStatus } from "@nestjs/common";

export class TwilioConfig{
    constructor(configService:ConfigService){
        configService = new ConfigService()
        this.accountSid = configService.get('TWILIO_ACCOUNT_SID');
        this.authToken = configService.get('TWILIO_AUTH');
        this.sourcePhoneNumber = configService.get('SOURCE_PHONE_NUMBER'),
        this.destinationPhoneNumber = configService.get('DESTINATION_PHONE_NUMBER')
        this.valid();
    }
    
    public async valid(){
        const errors = await validate(this); 
        if(errors.length> 0)
          throw new HttpException(errors, HttpStatus.NOT_ACCEPTABLE) 
      }


    @IsNotEmpty()
    @IsString()
    accountSid:string;

    @IsNotEmpty()
    @IsString()
    authToken:string;

    @IsNotEmpty()
    @IsString()
    sourcePhoneNumber:string
    
    @IsNotEmpty()
    @IsString()
    destinationPhoneNumber:string
}