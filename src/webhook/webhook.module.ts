import { Module, HttpModule } from "@nestjs/common";
import { WebhookController } from "./webhook.controller";
import { WebhookService } from "./webhook.service";
import { WeatherModule } from "src/weather/weather.module";
import { ConfigModule } from "@nestjs/config";
import { WebhookConfig } from "./webkook.config";

@Module({
    imports:[WeatherModule, HttpModule, ConfigModule],
    controllers: [WebhookController],
    providers: [WebhookService, WebhookConfig]
})

export class WebhookModule{}