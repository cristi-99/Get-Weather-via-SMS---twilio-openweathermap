import { Module, HttpModule } from "@nestjs/common";
import { TwilioController } from "./twilio.controller";
import { TwilioService } from "./twilio.service";
import { ConfigModule } from "@nestjs/config";
import { WeatherModule } from "src/weather/weather.module";


@Module({
    imports: [ConfigModule, WeatherModule],
    controllers: [TwilioController],
    providers: [TwilioService],
    exports: [TwilioService]
})

export class TwilioModule{}