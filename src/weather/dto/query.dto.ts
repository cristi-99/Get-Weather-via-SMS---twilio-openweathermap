import {
  IsNumber,
  IsString,
  Validate,
  IsNumberString,
  IsOptional,
} from 'class-validator';
import { CustomDateValidator } from './custom-date-validator';
import { ChildEntity } from 'typeorm';

export class QueryDto {
  @IsOptional()
  @IsNumberString()
  page: string;

  @IsOptional()
  @IsNumberString()
  howMany: string;

  @IsOptional()
  @Validate(CustomDateValidator, { message: 'Incorect date' })
  start: string;

  @IsOptional()
  @Validate(CustomDateValidator, { message: 'Incorect date' })
  end: string;

  @IsOptional()
  @IsString()
  source: string;

  @IsOptional()
  @IsString()
  city: string;
}
