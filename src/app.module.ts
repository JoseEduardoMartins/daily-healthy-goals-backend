import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { DailyCheckinsModule } from './modules/daily-checkins/daily-checkins.module';
import { UserDailyPlanModule } from './modules/user-daily-plan/user-daily-plan.module';
import { AuthModule } from './modules/auth/auth.module';
import { PainStatesModule } from './modules/pain-states/pain-states.module';
import { ProductsModule } from './modules/products/products.module';
import { ExercisesModule } from './modules/exercises/exercises.module';
import { IngredientsModule } from './modules/ingredients/ingredients.module';
import { ProductIngredientsModule } from './modules/product-ingredients/product-ingredients.module';
import { ExercisePrescriptionsModule } from './modules/exercise-prescriptions/exercise-prescriptions.module';
import { UserTypesModule } from './modules/user-types/user-types.module';
import { PlansModule } from './modules/plans/plans.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import jwtConfig from './config/jwt.config';
import mailConfig from './config/mail.config';
import stripeConfig from './config/stripe.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, mailConfig, stripeConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get('database'),
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
    UserTypesModule,
    PlansModule,
    SubscriptionsModule,
  ],
})
export class AppModule {}
