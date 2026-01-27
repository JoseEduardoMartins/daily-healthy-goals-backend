import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductIngredient } from './entities/product-ingredient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductIngredient])],
  exports: [TypeOrmModule],
})
export class ProductIngredientsModule {}
