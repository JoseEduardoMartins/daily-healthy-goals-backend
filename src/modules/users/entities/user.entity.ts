import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DailyCheckin } from '../../daily-checkins/entities/daily-checkin.entity';
import { UserType } from '../../user-types/entities/user-type.entity';
import { Plan } from '../../plans/entities/plan.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 300 })
  name: string;

  @Column({ type: 'varchar', length: 300, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'float', nullable: false })
  weight: number;

  @Column({ type: 'float', nullable: false })
  height: number;

  @CreateDateColumn({ type: 'datetime' })
  created_at: Date;

  @Column({ name: 'user_type_id', nullable: true })
  user_type_id: string | null;

  @Column({ name: 'plan_id', nullable: true })
  plan_id: string | null;

  @ManyToOne(() => UserType, (userType) => userType.users, { nullable: true })
  @JoinColumn({ name: 'user_type_id' })
  user_type: UserType | null;

  @ManyToOne(() => Plan, (plan) => plan.users, { nullable: true })
  @JoinColumn({ name: 'plan_id' })
  plan: Plan | null;

  @OneToMany(() => DailyCheckin, (checkin) => checkin.user)
  daily_checkins: DailyCheckin[];
}
