import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import twilio, * as Twilio from 'twilio';
import { WeatherService } from 'src/weather/weather.service';
import { DaysEnum } from '../consts/enumDays';
import { getExpectedTwilioSignature } from 'twilio/lib/webhooks/webhooks';
const MessagingResponse = require('twilio').twiml.MessagingResponse;

@Injectable()
export class TwilioService {
  private accountSid;
  private authToken;
  constructor(
    private configService: ConfigService,
    private weatherService: WeatherService,
  ) {
    this.accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
    this.authToken = this.configService.get('TWILIO_AUTH');
  }
  sendMessage(message) {
    const client = Twilio(this.accountSid, this.authToken);
    try {
      client.messages
        .create({
          body: message,
          from: this.configService.get('SOURCE_PHONE_NUMBER'),
          to: this.configService.get('DESTINATION_PHONE_NUMBER'),
        })
        .then(message => {
          return message.body;
        });
      return 'Message sent';
    } catch {
      (err: Error) => {
        throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
      };
    }
  }

  async receiveMessage(message: string) {
    let city = message.split(/\s+/);
    let days, weather;

    if (city.length === 2) days = 1;
    else {
      try {
        days = parseInt(city[1]);
      } catch {
        days = 1;
      }
    }

    weather = await this.weatherService.dailyWeather(city[0]);

    let currentDay = new Date().getDay();
    currentDay -= 1;

    let temperature: string = '';

    if (days > 7) {
      temperature += '\nWe can provide temperature just for seven days\n';
      days = 7;
    }

    temperature += `\nWeather for ${city[0]}:\n`

    for (var i = 0; i < days; i++) {
      currentDay = currentDay + 1;
      if (currentDay > 6) currentDay -= 7;
      temperature += `${DaysEnum[currentDay]} - ${Math.floor(
        parseInt(weather[i].temp.day) - 275.15,
      ).toString()} degrees ${weather[i].weather[0].main}\n`;
    }

    this.sendMessage(temperature);
    return 'responded';
  }
}
