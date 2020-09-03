import { Module, HttpModule } from "@nestjs/common";
import { WeatherController } from "./weather.controller";
import { WeatherService } from "./weather.service";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { Location, LocationSchema } from "src/database/schemas/location.schema";
import { WeatherConfig } from "./weather.config";


@Module({
    imports:[ConfigModule, HttpModule.register({
        timeout: 5000,
        maxRedirects: 5,
      }),
    MongooseModule.forFeature([{name:Location.name, schema: LocationSchema}])],
    controllers: [WeatherController],
    providers: [WeatherService, WeatherConfig],
    exports: [WeatherService]
})

export class WeatherModule{
}