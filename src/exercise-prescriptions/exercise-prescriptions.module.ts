import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExercisePrescription } from './entities/exercise-prescription.entity';
import { ExercisePrescriptionsService } from './exercise-prescriptions.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExercisePrescription])],
  providers: [ExercisePrescriptionsService],
  exports: [ExercisePrescriptionsService],
})
export class ExercisePrescriptionsModule {}
