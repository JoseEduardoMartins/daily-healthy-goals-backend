import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DailyCheckin } from '../../daily-checkins/entities/daily-checkin.entity';
import { GoalLibrary } from '../../goal-library/entities/goal-library.entity';

@Entity('user_daily_goals')
export class UserDailyGoal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'checkin_id' })
  checkin_id: string;

  @Column({ name: 'goal_library_id' })
  goal_library_id: number;

  @Column({ name: 'is_completed', type: 'boolean', default: false })
  is_completed: boolean;

  @ManyToOne(() => DailyCheckin, (checkin) => checkin.user_daily_goals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'checkin_id' })
  checkin: DailyCheckin;

  @ManyToOne(() => GoalLibrary, (goal) => goal.user_daily_goals)
  @JoinColumn({ name: 'goal_library_id' })
  goal_library: GoalLibrary;
}
