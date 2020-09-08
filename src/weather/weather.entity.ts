import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Location } from './location.entity';
import { Source } from './source.entity';
import { type } from 'os';

@Entity()
export class Weather {
  @PrimaryGeneratedColumn()
  public id?: number;

  @CreateDateColumn({type:"date"})
    date: Date;

  @Column()
  public temperature: number;

  @Column()
  public condition: string

  @ManyToOne(
    () => Location,
    (location: Location) => location.city,
  )
  @JoinColumn()
  public city: Location;

  @ManyToOne(
    () => Source,
    (source: Source) => source.source,
  )
  @JoinColumn()
  public source: Source;
}
