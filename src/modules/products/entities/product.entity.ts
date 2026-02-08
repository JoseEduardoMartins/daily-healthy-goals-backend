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
import { ProductIngredient } from '../../product-ingredients/entities/product-ingredient.entity';
import { UserDailyPlan } from '../../user-daily-plan/entities/user-daily-plan.entity';
import { UserType } from '../../user-types/entities/user-type.entity';
import { Plan } from '../../plans/entities/plan.entity';

@Entity('products')
export class Product {
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

  @Column({ name: 'moment_of_day', type: 'varchar', length: 100, nullable: true })
  moment_of_day: string;

  @Column({ type: 'text', nullable: true })
  benefits: string;

  @Column({ name: 'recipe_prep', type: 'text', nullable: true })
  recipe_prep: string;

  @Column({ name: 'user_type_id', nullable: true })
  user_type_id: string | null;

  @Column({ name: 'plan_id', nullable: true })
  plan_id: string | null;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => PainState, (painState) => painState.products)
  @JoinColumn({ name: 'pain_state_id' })
  pain_state: PainState;

  @ManyToOne(() => UserType, (userType) => userType.products, { nullable: true })
  @JoinColumn({ name: 'user_type_id' })
  user_type: UserType | null;

  @ManyToOne(() => Plan, (plan) => plan.products, { nullable: true })
  @JoinColumn({ name: 'plan_id' })
  plan: Plan | null;

  @OneToMany(() => ProductIngredient, (productIngredient) => productIngredient.product)
  product_ingredients: ProductIngredient[];

  @OneToMany(() => UserDailyPlan, (userDailyPlan) => userDailyPlan.product)
  user_daily_plans: UserDailyPlan[];
}
