import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Exercise } from '../exercises/entities/exercise.entity';
import { Plan } from '../plans/entities/plan.entity';
import { Subscription as SubscriptionEntity } from '../subscriptions/entities/subscription.entity';
import { DailyCheckin } from '../daily-checkins/entities/daily-checkin.entity';
import { UsersModule } from '../users/users.module';
import { PlansModule } from '../plans/plans.module';
import { UserTypesModule } from '../user-types/user-types.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Product,
      Exercise,
      Plan,
      SubscriptionEntity,
      DailyCheckin,
    ]),
    UsersModule,
    PlansModule,
    UserTypesModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
