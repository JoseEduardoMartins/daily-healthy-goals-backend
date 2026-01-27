import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDailyPlanService } from './user-daily-plan.service';
import { UserDailyPlanController } from './user-daily-plan.controller';
import { UserDailyPlan } from './entities/user-daily-plan.entity';
import { DailyCheckinsModule } from '../daily-checkins/daily-checkins.module';
import { ExercisePrescriptionsModule } from '../exercise-prescriptions/exercise-prescriptions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserDailyPlan]),
    forwardRef(() => DailyCheckinsModule),
    ExercisePrescriptionsModule,
  ],
  controllers: [UserDailyPlanController],
  providers: [UserDailyPlanService],
  exports: [UserDailyPlanService],
})
export class UserDailyPlanModule {}
