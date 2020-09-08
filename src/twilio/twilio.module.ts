import { Module, HttpModule } from "@nestjs/common";
import { TwilioController } from "./twilio.controller";
import { TwilioService } from "./twilio.service";
import { ConfigModule } from "@nestjs/config";
import { WeatherModule } from "src/weather/weather.module";
import { CustomConfigModule } from "src/config/config.module";
import { TwilioConfig } from "src/config/twilio.config";


@Module({
    imports: [CustomConfigModule, WeatherModule],
    controllers: [TwilioController],
    providers: [TwilioService],
    exports: [TwilioService]
})

export class TwilioModule{}