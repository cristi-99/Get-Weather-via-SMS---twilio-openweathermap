import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TwilioConfig } from "./twilio.config";
import { WebhookConfig } from "./webhook.config";
import { WeatherConfig } from "./weather.config";
import { DatabaseConfig } from "./database.config";


@Module({
    imports:[ConfigModule],
    providers:[WeatherConfig, TwilioConfig, WebhookConfig, DatabaseConfig],
    exports:[WeatherConfig, TwilioConfig, WeatherConfig,DatabaseConfig]
})

export class CustomConfigModule{};