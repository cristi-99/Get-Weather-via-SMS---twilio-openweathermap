import {Schema, Prop, SchemaFactory} from '@nestjs/mongoose'
import {Document} from 'mongoose'

@Schema()
export class Location extends Document {
    @Prop()
    address: string;

    @Prop()
    lat: string;

    @Prop()
    lng: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location)