import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { UserDailyGoal } from '../../user-daily-goals/entities/user-daily-goal.entity';

@Entity('daily_checkins')
export class DailyCheckin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  user_id: string;

  @Column({ name: 'category_id' })
  category_id: number;

  @Column({ name: 'checkin_date', type: 'date' })
  checkin_date: Date;

  @ManyToOne(() => User, (user) => user.daily_checkins, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Category, (category) => category.daily_checkins)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => UserDailyGoal, (userGoal) => userGoal.checkin, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user_daily_goals: UserDailyGoal[];
}
