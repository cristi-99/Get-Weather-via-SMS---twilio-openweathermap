import { Controller, Post, Get, Res, Req } from '@nestjs/common';
import { TwilioService } from './twilio.service';
import {Request} from 'express'

@Controller()
export class TwilioController {
  constructor(private twilioService: TwilioService) {}
  @Get('send')
  sendMessage() {
    return this.twilioService.sendMessage("endpoint Reached")
  }

  @Post('sms')
  receiveSms(@Req() req:Request){
    return this.twilioService.receiveMessage(req.body.Body);
  }

}
