import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserDailyPlan } from '../../user-daily-plan/entities/user-daily-plan.entity';
import { Exercise } from '../../exercises/entities/exercise.entity';

@Entity('exercise_prescriptions')
export class ExercisePrescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'plan_id', unique: true })
  plan_id: string;

  @Column({ name: 'exercise_id', nullable: true })
  exercise_id: string | null;

  @Column({ type: 'int' })
  sets: number;

  @Column({ type: 'varchar', length: 50 })
  reps: string;

  @Column({ name: 'rest_time', type: 'int', nullable: true })
  rest_time: number | null;

  @Column({ type: 'text', nullable: true })
  observations: string | null;

  @OneToOne(() => UserDailyPlan, (plan) => plan.exercise_prescription, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'plan_id' })
  plan: UserDailyPlan;

  @ManyToOne(() => Exercise, (exercise) => exercise.exercise_prescriptions, {
    nullable: true,
  })
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercise | null;
}
