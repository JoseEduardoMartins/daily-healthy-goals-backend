import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDailyGoalsService } from './user-daily-goals.service';
import { UserDailyGoalsController } from './user-daily-goals.controller';
import { UserDailyGoal } from './entities/user-daily-goal.entity';
import { DailyCheckinsModule } from '../daily-checkins/daily-checkins.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserDailyGoal]),
    forwardRef(() => DailyCheckinsModule),
  ],
  controllers: [UserDailyGoalsController],
  providers: [UserDailyGoalsService],
  exports: [UserDailyGoalsService],
})
export class UserDailyGoalsModule {}
