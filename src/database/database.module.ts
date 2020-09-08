import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from '../config/database.config';
import { CustomConfigModule } from 'src/config/config.module';
import { Source } from '../weather/source.entity';
import { Weather } from '../weather/weather.entity';
import { Location } from '../weather/location.entity';
import {AddSources1599479738171} from '../migration/1599479738171-AddSources'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [CustomConfigModule],
      inject: [DatabaseConfig],

      useFactory: (constDto: DatabaseConfig) => ({
        type: 'postgres',
        host: constDto.POSTGRES_HOST,
        port: constDto.POSTGRES_PORT,
        username: constDto.POSTGRES_USER,
        password: constDto.POSTGRES_PASSWORD,
        database: constDto.POSTGRES_DB,
        synchronize: true,
        migrations: [AddSources1599479738171],
        migrationsRun: true,
        entities: [Weather, Location, Source],
      }),
    }),
  ],
})
export class DatabaseModule {}
