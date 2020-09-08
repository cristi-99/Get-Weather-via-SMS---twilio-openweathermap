import { Module, HttpModule } from "@nestjs/common";
import { WebhookController } from "./webhook.controller";
import { WebhookService } from "./webhook.service";
import { WeatherModule } from "src/weather/weather.module";
import { ConfigModule } from "@nestjs/config";
import { CustomConfigModule } from "src/config/config.module";
import { WebhookConfig } from "src/config/webhook.config";


@Module({
    imports:[WeatherModule, HttpModule, CustomConfigModule],
    controllers: [WebhookController],
    providers: [WebhookService, WebhookConfig]
})

export class WebhookModule{}