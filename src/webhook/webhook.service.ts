import {
  Injectable,
  HttpException,
  NotFoundException,
  HttpStatus,
  ForbiddenException,
  HttpService,
} from '@nestjs/common';
import { WeatherService } from 'src/weather/weather.service';
import { DaysEnum } from 'src/consts/enumDays';
import { catchError, map } from 'rxjs/operators';
import { WebhookConfig } from '../config/webhook.config';
import { Weather } from 'src/weather/weather.entity';

@Injectable()
export class WebhookService {
  constructor(
    private weatherService: WeatherService,
    private httpService: HttpService,
    private webhookConfig: WebhookConfig,
  ) {}
  verify(query) {
    let verifyToken:string = this.webhookConfig.verifyToken;
    let mode:string = query['hub.mode'];
    let token:string = query['hub.verify_token'];
    let challenge:string = query['hub.challenge'];

    if (mode && token) {
      if (mode === 'subscribe' && token === verifyToken) {
        return challenge;
      }
    } else throw new HttpException(ForbiddenException, HttpStatus.FORBIDDEN);
  }
  public receiveEvent(body) {
    if (body.object === 'page') {
      body.entry.forEach(entry => {
        let webhook_event = entry.messaging[0];
        let messageReceived = webhook_event.message.text;
        this.handleMessage(messageReceived, webhook_event.sender.id);
      });
      return HttpStatus.OK
    } else throw new HttpException(NotFoundException, HttpStatus.NOT_FOUND);
  }

  async handleMessage(message:string, sender_psid:string) {
    let city:Array<string> = message.split(/\s+/);
    let days: number = 0;

    if (city.length === 1) days = 1;
    else {
      try {
        days = parseInt(city[1]);
      } catch {
        days = 1;
      }
    }
    if (isNaN(days)) days = 1;
    let weather:Weather = await this.weatherService.dailyWeather(city[0], 'Messenger');
    if (!weather) {
      this.callSendAPI(sender_psid, 'Incorrect city');
      throw new HttpException( 'Incorrect city', HttpStatus.BAD_REQUEST)
    }
    let currentDay:number = new Date().getDay();
    currentDay -= 1;

    let temperature: string = '';

    if (days > 7) {
      temperature += '\nWe can provide temperature just for seven days\n';
      days = 7;
    }

    temperature += `\nWeather for ${city[0]}:\n`;

    for (var i = 0; i < days; i++) {
      currentDay = currentDay + 1;
      if (currentDay > 6) currentDay -= 7;
      temperature += `${DaysEnum[currentDay]} - ${Math.floor(
        parseInt(weather[i].temp.day) - 275.15,
      ).toString()} degrees ${weather[i].weather[0].main}\n`;
    }
    this.callSendAPI(sender_psid, temperature);
  }

  async callSendAPI(sender_psid, response) {
    let request_body = {
      recipient: {
        id: sender_psid,
      },
      message: {
        text: response,
      },
    };
    const messengerToken = this.webhookConfig.messengerToken;
    const headers:object = { 'Content-Type': 'application/json' };

    return this.httpService
      .post(
        this.webhookConfig.webhookUrl + `?access_token=${messengerToken}`,
        request_body,
        { headers },
      )
      .pipe(
        map(res => {
          return res.data;
        }),
        catchError(e => {
          throw new HttpException(e.response.data, e.response.status);
        }),
      )
      .toPromise()
      .catch(e => {
        throw new HttpException(e.message, e.code);
      });
  }
}
