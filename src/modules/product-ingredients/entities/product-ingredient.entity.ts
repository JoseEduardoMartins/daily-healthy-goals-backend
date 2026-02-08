import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Ingredient } from '../../ingredients/entities/ingredient.entity';

@Entity('product_ingredients')
export class ProductIngredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id' })
  product_id: string;

  @Column({ name: 'ingredient_id' })
  ingredient_id: string;

  @Column({ type: 'int' })
  units: number;

  @Column({ name: 'quantity_per_unit', type: 'int' })
  quantity_per_unit: number;

  @ManyToOne(() => Product, (product) => product.product_ingredients, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.product_ingredients, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: Ingredient;
}
