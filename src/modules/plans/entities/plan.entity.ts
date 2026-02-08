import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
import { Exercise } from '../../exercises/entities/exercise.entity';

@Entity('plans')
export class Plan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string; // 'bronze', 'silver', 'gold', etc.

  @Column({ type: 'varchar', length: 50 })
  level: string; // 'bronze', 'silver', 'gold' - para hierarquia

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @OneToMany(() => User, (user) => user.plan)
  users: User[];

  @OneToMany(() => Product, (product) => product.plan)
  products: Product[];

  @OneToMany(() => Exercise, (exercise) => exercise.plan)
  exercises: Exercise[];
}
