import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { PainState } from '../../pain-states/entities/pain-state.entity';
import { ExercisePrescription } from '../../exercise-prescriptions/entities/exercise-prescription.entity';
import { UserType } from '../../user-types/entities/user-type.entity';
import { Plan } from '../../plans/entities/plan.entity';

@Entity('exercise')
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'category_id' })
  category_id: string;

  @Column({ name: 'pain_state_id' })
  pain_state_id: string;

  @Column({ type: 'varchar', length: 300 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'image_url', type: 'text', nullable: true })
  image_url: string;

  @Column({ name: 'video_url', type: 'text', nullable: true })
  video_url: string;

  @Column({
    type: 'enum',
    enum: ['easy', 'medium', 'hard'],
    nullable: true,
  })
  difficulty: string;

  @Column({ name: 'user_type_id', nullable: true })
  user_type_id: string | null;

  @Column({ name: 'plan_id', nullable: true })
  plan_id: string | null;

  @ManyToOne(() => Category, (category) => category.exercises)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => PainState, (painState) => painState.exercises)
  @JoinColumn({ name: 'pain_state_id' })
  pain_state: PainState;

  @ManyToOne(() => UserType, (userType) => userType.exercises, { nullable: true })
  @JoinColumn({ name: 'user_type_id' })
  user_type: UserType | null;

  @ManyToOne(() => Plan, (plan) => plan.exercises, { nullable: true })
  @JoinColumn({ name: 'plan_id' })
  plan: Plan | null;

  @OneToMany(() => ExercisePrescription, (prescription) => prescription.exercise)
  exercise_prescriptions: ExercisePrescription[];
}
