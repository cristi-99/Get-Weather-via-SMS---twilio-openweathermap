import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Weather } from './weather.entity';

@Entity()
export class Source {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  public source: string;

  @OneToMany(
    () => Weather,
    (weather: Weather) => weather.id,
  )
  public weather: Weather[];
}
