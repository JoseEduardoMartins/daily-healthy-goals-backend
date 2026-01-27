import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { GoalLibrary } from '../../goal-library/entities/goal-library.entity';
import { DailyCheckin } from '../../daily-checkins/entities/daily-checkin.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @OneToMany(() => GoalLibrary, (goal) => goal.category)
  goals: GoalLibrary[];

  @OneToMany(() => DailyCheckin, (checkin) => checkin.category)
  daily_checkins: DailyCheckin[];
}
