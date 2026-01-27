import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { UserDailyGoal } from '../../user-daily-goals/entities/user-daily-goal.entity';

@Entity('goal_library')
export class GoalLibrary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'category_id' })
  category_id: number;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => Category, (category) => category.goals)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => UserDailyGoal, (userGoal) => userGoal.goal_library)
  user_daily_goals: UserDailyGoal[];
}
