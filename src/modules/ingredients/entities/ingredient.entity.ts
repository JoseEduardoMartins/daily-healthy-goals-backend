import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { ProductIngredient } from '../../product-ingredients/entities/product-ingredient.entity';

@Entity('ingredients')
export class Ingredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 300 })
  name: string;

  @Column({
    type: 'enum',
    enum: ['g', 'kg', 'ml', 'L', 'un'],
    nullable: true,
  })
  unit: string;

  @OneToMany(() => ProductIngredient, (productIngredient) => productIngredient.ingredient)
  product_ingredients: ProductIngredient[];
}
