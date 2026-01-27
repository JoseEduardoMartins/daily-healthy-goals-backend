import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyCheckinsService } from './daily-checkins.service';
import { DailyCheckinsController } from './daily-checkins.controller';
import { DailyCheckin } from './entities/daily-checkin.entity';
import { CategoriesModule } from '../categories/categories.module';
import { GoalLibraryModule } from '../goal-library/goal-library.module';
import { UserDailyGoalsModule } from '../user-daily-goals/user-daily-goals.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyCheckin]),
    CategoriesModule,
    GoalLibraryModule,
    forwardRef(() => UserDailyGoalsModule),
  ],
  controllers: [DailyCheckinsController],
  providers: [DailyCheckinsService],
  exports: [DailyCheckinsService],
})
export class DailyCheckinsModule {}
