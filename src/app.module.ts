import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { DailyCheckinsModule } from './daily-checkins/daily-checkins.module';
import { UserDailyPlanModule } from './user-daily-plan/user-daily-plan.module';
import { AuthModule } from './auth/auth.module';
import { PainStatesModule } from './pain-states/pain-states.module';
import { ProductsModule } from './products/products.module';
import { ExercisesModule } from './exercises/exercises.module';
import { IngredientsModule } from './ingredients/ingredients.module';
import { ProductIngredientsModule } from './product-ingredients/product-ingredients.module';
import { ExercisePrescriptionsModule } from './exercise-prescriptions/exercise-prescriptions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'app_user'),
        password: configService.get('DB_PASSWORD', 'app_password'),
        database: configService.get('DB_DATABASE', 'daily_healthy_goals'),
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    CategoriesModule,
    DailyCheckinsModule,
    UserDailyPlanModule,
    AuthModule,
    PainStatesModule,
    ProductsModule,
    ExercisesModule,
    IngredientsModule,
    ProductIngredientsModule,
    ExercisePrescriptionsModule,
  ],
})
export class AppModule {}
