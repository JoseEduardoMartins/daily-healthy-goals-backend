import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Exercise } from '../../exercises/entities/exercise.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 300 })
  name: string;

  @Column({ name: 'image_url', type: 'text', nullable: true })
  image_url: string;

  @Column({
    type: 'enum',
    enum: ['diet', 'exercise'],
  })
  type: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @OneToMany(() => Exercise, (exercise) => exercise.category)
  exercises: Exercise[];
}
