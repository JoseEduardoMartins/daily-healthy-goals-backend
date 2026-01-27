import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyCheckinsService } from './daily-checkins.service';
import { DailyCheckinsController } from './daily-checkins.controller';
import { DailyCheckin } from './entities/daily-checkin.entity';
import { PainStatesModule } from '../pain-states/pain-states.module';
import { ProductsModule } from '../products/products.module';
import { ExercisesModule } from '../exercises/exercises.module';
import { UserDailyPlanModule } from '../user-daily-plan/user-daily-plan.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DailyCheckin]),
    PainStatesModule,
    ProductsModule,
    ExercisesModule,
    forwardRef(() => UserDailyPlanModule),
  ],
  controllers: [DailyCheckinsController],
  providers: [DailyCheckinsService],
  exports: [DailyCheckinsService],
})
export class DailyCheckinsModule {}
