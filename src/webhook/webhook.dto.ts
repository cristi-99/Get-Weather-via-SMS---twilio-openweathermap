import { IsArray, IsString } from "class-validator";

export class WebhookDto{
    @IsString()
    object:string;

    @IsArray()
    entry:Array<any>
}