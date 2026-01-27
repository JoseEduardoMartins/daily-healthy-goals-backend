import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { DailyCheckin } from '../../daily-checkins/entities/daily-checkin.entity';
import { Product } from '../../products/entities/product.entity';
import { ExercisePrescription } from '../../exercise-prescriptions/entities/exercise-prescription.entity';

@Entity('user_daily_plan')
export class UserDailyPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'checkin_id' })
  checkin_id: string;

  @Column({ name: 'product_id', nullable: true })
  product_id: string | null;

  @Column({ name: 'is_completed', type: 'boolean', default: false })
  is_completed: boolean;

  @ManyToOne(() => DailyCheckin, (checkin) => checkin.user_daily_plans, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'checkin_id' })
  checkin: DailyCheckin;

  @ManyToOne(() => Product, (product) => product.user_daily_plans, {
    nullable: true,
  })
  @JoinColumn({ name: 'product_id' })
  product: Product | null;

  @OneToOne(() => ExercisePrescription, (prescription) => prescription.plan, {
    nullable: true,
  })
  exercise_prescription: ExercisePrescription | null;
}
