import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
import { Exercise } from '../../exercises/entities/exercise.entity';

@Entity('user_types')
export class UserType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string; // 'admin', 'visitante', 'pagante'

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => User, (user) => user.user_type)
  users: User[];

  @OneToMany(() => Product, (product) => product.user_type)
  products: Product[];

  @OneToMany(() => Exercise, (exercise) => exercise.user_type)
  exercises: Exercise[];
}
