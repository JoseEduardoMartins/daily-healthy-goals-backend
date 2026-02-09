import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Subscription } from './subscription.entity';

export enum PaymentStatus {
  PAID = 'paid',
  FAILED = 'failed',
  PENDING = 'pending',
}

@Entity('payment_history')
export class PaymentHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'subscription_id' })
  subscription_id: string;

  @Column({ name: 'stripe_invoice_id', nullable: true })
  stripe_invoice_id: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'BRL' })
  currency: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
  })
  status: PaymentStatus;

  @Column({ name: 'paid_at', type: 'datetime', nullable: true })
  paid_at: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  created_at: Date;

  @ManyToOne(() => Subscription, (subscription) => subscription.payment_history)
  @JoinColumn({ name: 'subscription_id' })
  subscription: Subscription;
}
