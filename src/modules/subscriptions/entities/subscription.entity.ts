import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Plan } from '../../plans/entities/plan.entity';
import { PaymentHistory } from './payment-history.entity';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  EXPIRED = 'expired',
  PAST_DUE = 'past_due',
  TRIALING = 'trialing',
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  user_id: string;

  @Column({ name: 'plan_id' })
  plan_id: string;

  @Column({ name: 'stripe_subscription_id', nullable: true, unique: true })
  stripe_subscription_id: string | null;

  @Column({ name: 'stripe_customer_id', nullable: true })
  stripe_customer_id: string | null;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.TRIALING,
  })
  status: SubscriptionStatus;

  @Column({ name: 'current_period_start', type: 'datetime' })
  current_period_start: Date;

  @Column({ name: 'current_period_end', type: 'datetime' })
  current_period_end: Date;

  @Column({ name: 'cancel_at_period_end', type: 'boolean', default: false })
  cancel_at_period_end: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.subscriptions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Plan)
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @OneToMany(() => PaymentHistory, (payment) => payment.subscription)
  payment_history: PaymentHistory[];
}
