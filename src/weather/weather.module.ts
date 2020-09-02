import { Module, HttpModule } from "@nestjs/common";
import { WeatherController } from "./weather.controller";
import { WeatherService } from "./weather.service";
import { ConfigModule } from "@nestjs/config";


@Module({
    imports:[ConfigModule, HttpModule.register({
        timeout: 5000,
        maxRedirects: 5,
      }),],
    controllers: [WeatherController],
    providers: [WeatherService],
    exports: [WeatherService]
})

export class WeatherModule{
}