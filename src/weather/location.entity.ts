import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Timestamp } from 'rxjs/internal/operators/timestamp';
import { Weather } from './weather.entity';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  public longitude: string;

  @Column()
  public latitude: string;

  @Column()
  public city: string;

  @OneToMany(
    () => Weather,
    (weather: Weather) => weather.id,
  )
  public weather: Weather[];
}
