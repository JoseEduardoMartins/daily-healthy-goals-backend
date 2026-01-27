import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Exercise } from '../../exercises/entities/exercise.entity';
import { DailyCheckin } from '../../daily-checkins/entities/daily-checkin.entity';

@Entity('pain_states')
export class PainState {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @OneToMany(() => Product, (product) => product.pain_state)
  products: Product[];

  @OneToMany(() => Exercise, (exercise) => exercise.pain_state)
  exercises: Exercise[];

  @OneToMany(() => DailyCheckin, (checkin) => checkin.pain_state)
  daily_checkins: DailyCheckin[];
}
