import { ConfigService } from "@nestjs/config";
import { validate, IsString, IsUrl, IsNotEmpty } from "class-validator";
import { HttpException, HttpStatus } from "@nestjs/common";

export class WebhookConfig{
    constructor(private readonly configService:ConfigService){
        this.configService = new ConfigService()
        this.messengerToken = this.configService.get('MESSENGER_TOKEN');
        this.webhookUrl = 'https://graph.facebook.com/v2.6/me/messages'
        this.verifyToken = this.configService.get('VERIFY_TOKEN_MESSENGER');
        this.valid();
    }
    
    public async valid(){
        const errors = await validate(this); 
        if(errors.length> 0)
          throw new HttpException(errors, HttpStatus.NOT_ACCEPTABLE) 
      }

    @IsUrl()
    @IsNotEmpty()
    webhookUrl:string;
    
    @IsNotEmpty()
    verifyToken:string;

    @IsString()
    @IsNotEmpty()
    messengerToken:string;
}