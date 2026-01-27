import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PainState } from '../../pain-states/entities/pain-state.entity';
import { UserDailyPlan } from '../../user-daily-plan/entities/user-daily-plan.entity';

@Entity('daily_checkins')
export class DailyCheckin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  user_id: string;

  @Column({ name: 'pain_state_id' })
  pain_state_id: string;

  @Column({ name: 'checkin_date', type: 'date' })
  checkin_date: Date;

  @ManyToOne(() => User, (user) => user.daily_checkins, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => PainState, (painState) => painState.daily_checkins)
  @JoinColumn({ name: 'pain_state_id' })
  pain_state: PainState;

  @OneToMany(() => UserDailyPlan, (userPlan) => userPlan.checkin, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user_daily_plans: UserDailyPlan[];
}
