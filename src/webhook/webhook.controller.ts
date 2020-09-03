import { Controller, Res, Req, Body, Query, Post, Get } from '@nestjs/common';
import { response, query } from 'express';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
  constructor(private webhookService: WebhookService) {}
  @Get()
    verifyToken(@Query() query){
        return this.webhookService.verify(query);
    }
  @Post()
  receiveEvent(@Body() body) {
      return this.webhookService.receiveEvent(body)
    
  }
}
